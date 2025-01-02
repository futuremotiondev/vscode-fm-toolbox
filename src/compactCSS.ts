import * as vscode from 'vscode';
import {
	commands, Disposable, ExtensionContext, Range, TextDocument, TextDocumentSaveReason,
	TextEditor, Uri, window, workspace, WorkspaceEdit
} from 'vscode';

export async function compactCSS(editor: TextEditor, keybindingsPassed?: unknown) {

    const document = editor.document;
    const selection = editor.selection;

    if (selection.isEmpty) {
        vscode.window.showErrorMessage("No text selected!");
        return;
    }

    const selectedText = document.getText(selection);

    // First, compact the CSS rules within the blocks
    let compactedText = selectedText.replace(/\{\s*([^}]*?)\s*\}/gms, (_, p1) => `{ ${p1.replace(/(\r\n|\n|\r)[ \t]*/gm, " ")} }`);

    // Then, remove empty lines between CSS rules
    compactedText = compactedText.replace(/(\r\n|\n|\r){2,}/gm, '\n');

    await editor.edit(editBuilder => {
        editBuilder.replace(selection, compactedText);
    });
}
