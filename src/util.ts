import * as vscode from 'vscode';
import { TextDocument, TextEditor, workspace } from 'vscode';

/**
 * Assume argument is of TextEditor type if it has the `document` property.
 */
export function isEditor(arg: any): arg is TextEditor {
	return Boolean(arg.document);
}

export function validateEditor(editor: vscode.TextEditor | undefined): boolean {
    if (!editor) {
        vscode.window.showErrorMessage("Error: No active editor.");
        return false;
    }
    if (!isEditor(editor)) {
        vscode.window.showErrorMessage("Error: Editor does not have the 'document' property.");
        return false;
    }
    return true;
}

export function getDefinedRulers(document?: TextDocument): { color: string; column: number }[] {
    // Retrieve editor configuration for rulers
    const editorConfig = workspace.getConfiguration('editor', document);
    const rulers = editorConfig.get<{ color: string; column: number }[]>('rulers');

    // Return rulers if they are defined, otherwise return an empty array
    return rulers || [];
}