import * as vscode from 'vscode';
import {
	commands, Disposable, ExtensionContext, Range, TextDocument, TextDocumentSaveReason,
	TextEditor, Uri, window, workspace, WorkspaceEdit
} from 'vscode';

export function alignSelectionBySpaces(editor: TextEditor, keybinding?: unknown): void {
    const document = editor.document;
    const selections = editor.selections;

    editor.edit(editBuilder => {
        selections.forEach(selection => {
            const range = new vscode.Range(selection.start, selection.end);
            const selectedText = document.getText(range);

            // Split lines and process each line
            const lines = selectedText.split('\n');
            const splitLines = lines.map(line => line.split(/ {2,}/));

            // Determine maximum length of column 1
            const maxCol1Length = Math.max(...splitLines.map(parts => parts[0].length));

            // Construct aligned text
            const alignedText = splitLines.map(parts => {
                const col1 = parts[0];
                const col2 = parts[1] || '';
                const padding = ' '.repeat(maxCol1Length - col1.length + 1); // +1 for space between columns
                return `${col1}${padding}${col2}`;
            }).join('\n');

            // Replace the selected text with aligned text
            editBuilder.replace(range, alignedText);
        });
    });
}
