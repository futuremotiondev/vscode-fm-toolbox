import * as vscode from 'vscode';
import { removeLinebreaks } from './removeLinebreaks';
import { removeEmptyLines } from './removeEmptyLines';
import { compactCSS } from './compactCSS';
import { expandCSS } from './expandCSS';
import { isEditor } from './util';
import { alignSelectionBySpaces } from './alignSelectionBySpaces';
import { getExtensionConfig } from './extensionConfig';

export type IRange = [number, number];
export const enum Constants { ExtensionPrefix = 'fm-toolbox', }
export const enum FuturemotionCommandIds {
    removeLineBreaksSelected  = 'fm-toolbox.removeLineBreaksInSelection',
    removeEmptyLinesDocument  = 'fm-toolbox.removeEmptyLinesInDocument',
    removeEmptyLinesSelection = 'fm-toolbox.removeEmptyLinesInSelection',
    alignSelectionBySpaces    = 'fm-toolbox.alignSelectionBySpaces',
    compactCSSSelected        = 'fm-toolbox.compactSelectedCSS',
    expandCSSSelected         = 'fm-toolbox.expandSelectedCSS',
}

function validateEditor(editor: vscode.TextEditor | undefined): boolean {
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


export function activate(context: vscode.ExtensionContext) {


    let removeLinebreaksCommand = vscode.commands.registerTextEditorCommand(FuturemotionCommandIds.removeLineBreaksSelected, (editor, edit, keybinding?: number) => {
        if(validateEditor(editor)){
            removeLinebreaks(editor, keybinding);
        }
    });

    let removeEmptyLinesInDocumentCommand = vscode.commands.registerTextEditorCommand(FuturemotionCommandIds.removeEmptyLinesDocument, (editor, edit, keybinding?: number) => {
        if(validateEditor(editor)){
            removeEmptyLines(editor, false, keybinding);
        }
    });

    let removeEmptyLinesInSelectedCommand = vscode.commands.registerTextEditorCommand(FuturemotionCommandIds.removeEmptyLinesSelection, (editor, edit, keybinding?: number) => {
        if(validateEditor(editor)){
            removeEmptyLines(editor, true, keybinding);
        }
    });

    let alignSelectionBySpacesCommand = vscode.commands.registerTextEditorCommand(FuturemotionCommandIds.alignSelectionBySpaces, (editor, edit, keybinding?: number) => {
        if(validateEditor(editor)){
            alignSelectionBySpaces(editor, keybinding);
        }
    });

    let compactCSSCommand = vscode.commands.registerTextEditorCommand(FuturemotionCommandIds.compactCSSSelected, (editor, edit, keybinding?: number) => {
        if(validateEditor(editor)){
            compactCSS(editor, keybinding);
        }
    });

    let expandCSSCommand = vscode.commands.registerTextEditorCommand(FuturemotionCommandIds.expandCSSSelected, (editor, edit, keybinding?: number) => {
        if(validateEditor(editor)){
            expandCSS(editor, keybinding);
        }
    });

    context.subscriptions.push(removeLinebreaksCommand);
    context.subscriptions.push(removeEmptyLinesInDocumentCommand);
    context.subscriptions.push(removeEmptyLinesInSelectedCommand);
    context.subscriptions.push(alignSelectionBySpacesCommand);
    context.subscriptions.push(compactCSSCommand);
    context.subscriptions.push(expandCSSCommand);
}

export function deactivate() {}
