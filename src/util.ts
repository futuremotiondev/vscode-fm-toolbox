import {
	commands, Disposable, ExtensionContext, Range, TextDocument, TextDocumentSaveReason,
	TextEditor, Uri, window, workspace, WorkspaceEdit
} from 'vscode';

/**
 * Assume argument is of TextEditor type if it has the `document` property.
 */
export function isEditor(arg: any): arg is TextEditor {
	return Boolean(arg.document);
}