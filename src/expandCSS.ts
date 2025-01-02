import * as vscode from 'vscode';
import {
	commands, Disposable, ExtensionContext, Range, TextDocument, TextDocumentSaveReason,
	TextEditor, Uri, window, workspace, WorkspaceEdit
} from 'vscode';


export async function expandCSS(editor: TextEditor, keybindingsPassed?: unknown) {
    const document = editor.document;
    const selection = editor.selection;

    if (selection.isEmpty) {
        vscode.window.showErrorMessage("No text selected!");
        return;
    }

    const selectedText = document.getText(selection);

    // Step 1: Insert a newline and tab after `{`
    let expandedText = selectedText.replace(/\{\s*/g, "{\n\t");

    // Step 2: Insert a newline and tab after `;`
    expandedText = expandedText.replace(/;\s*/g, ";\n\t");

    // Step 3: Adjust the replacement to handle the last property's semicolon (if any) differently
    // This step is to prevent adding an extra tab after the last property inside a rule
    expandedText = expandedText.replace(/;\n\t}/g, ";\n}");

    // Step 4: Insert a newline before `}`
    expandedText = expandedText.replace(/\s*\}/g, "\n}");

    await editor.edit(editBuilder => {
        editBuilder.replace(selection, expandedText);
    });
}