import * as vscode from 'vscode';
import {
	commands, Disposable, ExtensionContext, Range, TextDocument, TextDocumentSaveReason,
	TextEditor, Uri, window, workspace, WorkspaceEdit
} from 'vscode';
import { Constants } from './extension';

export interface ExtensionConfig {
    allowedNumberOfEmptyLines: number;
}

export function getExtensionConfig(document?: TextDocument): ExtensionConfig {
    let allowedNumberOfEmptyLines = 0;
    const config = workspace.getConfiguration(undefined, document).get(Constants.ExtensionPrefix) as ExtensionConfig;
    if (!config) {
        return { allowedNumberOfEmptyLines };
    }
    if (config.allowedNumberOfEmptyLines >= 0 && config.allowedNumberOfEmptyLines <= 100) {
        allowedNumberOfEmptyLines = config.allowedNumberOfEmptyLines;
    }
    return { allowedNumberOfEmptyLines };
}