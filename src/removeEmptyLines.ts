import * as vscode from 'vscode';
import {
	commands, Disposable, ExtensionContext, Range, TextDocument, TextDocumentSaveReason,
	TextEditor, Uri, window, workspace, WorkspaceEdit
} from 'vscode';
import { IRange } from './extension';
import { getExtensionConfig } from './extensionConfig';
import { isEditor } from './util';

export function removeEmptyLines(editor: TextEditor, inSelection: boolean, keybindingsPassedAllowedNumberOfEmptyLines?: unknown) {
    const $config = getExtensionConfig(editor.document);
	if (typeof keybindingsPassedAllowedNumberOfEmptyLines === 'number') {
		$config.allowedNumberOfEmptyLines = keybindingsPassedAllowedNumberOfEmptyLines;
	}
	const { document } = editor;
	if (inSelection) {
		const { selections } = editor;

		if (selections.length === 1 && selections[0].isEmpty) {
			// remove all adjacent empty lines up & down of the cursor
			const activeLine = document.lineAt(selections[0].start.line);
			if (!activeLine.isEmptyOrWhitespace) {
				return;
			} else {
				const closestUp = findUpClosestNonEmptyLine(selections[0].start.line, document);
				const closestDown = findDownClosestNonEmptyLine(selections[0].start.line, document);
				removeEmptyLinesInRange(editor, document, [[closestUp, closestDown]], $config.allowedNumberOfEmptyLines);
			}
		} else {
			const ranges: IRange[] = [];
			for (const selection of selections) {
				ranges.push([selection.start.line, selection.end.line]);
			}
			removeEmptyLinesInRange(editor, document, ranges, $config.allowedNumberOfEmptyLines);
		}
	} else {
		removeEmptyLinesInRange(editor, document, [[0, document.lineCount - 1]], $config.allowedNumberOfEmptyLines);
	}
}

function removeEmptyLinesInRange(editorOrUri: TextEditor | Uri, document: TextDocument, ranges: IRange[], allowedNumberOfEmptyLines: number) {
	const rangesToDelete: Range[] = [];

	for (const range of ranges) {
		let numberOfConsequtiveEmptyLines = 0;
		for (let i = range[0]; i <= range[1]; i++) {
			const line = document.lineAt(i);
			if (line.isEmptyOrWhitespace) {
				numberOfConsequtiveEmptyLines++;
				if (numberOfConsequtiveEmptyLines > allowedNumberOfEmptyLines) {
					rangesToDelete.push(line.rangeIncludingLineBreak);
				}
			} else {
				numberOfConsequtiveEmptyLines = 0;
			}
		}
	}
	if (isEditor(editorOrUri)) {
		editorOrUri.edit(edit => {
			for (const range of rangesToDelete) {
				edit.delete(range);
			}
		});
	} else {
		// When editor is not visible - it seems not possible to find it. But uri can be used with WorkspaceEdit.
		const workspaceEdit = new WorkspaceEdit();
		for (const range of rangesToDelete) {
			workspaceEdit.delete(document.uri, range);
		}
		workspace.applyEdit(workspaceEdit);
	}
}

function findUpClosestNonEmptyLine(ln: number, document: TextDocument) {
	for (let i = ln; i > 0; i--) {
		const lineAt = document.lineAt(i);
		if (lineAt.isEmptyOrWhitespace) {
			continue;
		}
		return i;
	}
	return 0;
}


function findDownClosestNonEmptyLine(ln: number, document: TextDocument) {
	for (let i = ln; i < document.lineCount; i++) {
		const lineAt = document.lineAt(i);
		if (lineAt.isEmptyOrWhitespace) {
			continue;
		}
		return i;
	}
	return document.lineCount - 1;
}

