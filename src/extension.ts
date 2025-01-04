import * as vscode from 'vscode';
import { removeLinebreaks } from './removeLinebreaks';
import { removeEmptyLines } from './removeEmptyLines';
import { compactCSS } from './compactCSS';
import { expandCSS } from './expandCSS';
import { wrapPowershellArray } from './wrapPowershellArray';
import { alignSelectionBySpaces } from './alignSelectionBySpaces';
import { validateEditor } from './util';

export type IRange = [number, number];
export const enum Constants { ExtensionPrefix = 'fm-toolbox', }
export const enum FuturemotionCommandIds {
    removeLineBreaksSelected      = 'fm-toolbox.removeLineBreaksInSelection',
    removeEmptyLinesDocument      = 'fm-toolbox.removeEmptyLinesInDocument',
    removeEmptyLinesSelection     = 'fm-toolbox.removeEmptyLinesInSelection',
    alignSelectionBySpaces        = 'fm-toolbox.alignSelectionBySpaces',
    compactCSSSelected            = 'fm-toolbox.compactSelectedCSS',
    expandCSSSelected             = 'fm-toolbox.expandSelectedCSS',
    wrapPowershellArrayConfig     = 'fm-toolbox.wrapPowershellArrayConfig',
    wrapPowershellArraySpecified  = 'fm-toolbox.wrapPowershellArraySpecified',
    wrapPowershellArrayFirstRuler = 'fm-toolbox.wrapPowershellArrayFirstRuler',
}

export const enum PowershellArrayWrapMode {
    Specified  = 'Specified',
    Configured = 'Configured',
    FirstRuler = 'FirstRuler'
}

export function activate(context: vscode.ExtensionContext) {


    let removeLinebreaksCommand = vscode.commands.registerTextEditorCommand(
        FuturemotionCommandIds.removeLineBreaksSelected, (editor, edit, keybinding?: number) => {
        if(validateEditor(editor)){
            removeLinebreaks(editor, keybinding);
        }
    });

    let removeEmptyLinesInDocumentCommand = vscode.commands.registerTextEditorCommand(
        FuturemotionCommandIds.removeEmptyLinesDocument, (editor, edit, keybinding?: number) => {
        if(validateEditor(editor)){
            removeEmptyLines(editor, false, keybinding);
        }
    });

    let removeEmptyLinesInSelectedCommand = vscode.commands.registerTextEditorCommand(
        FuturemotionCommandIds.removeEmptyLinesSelection, (editor, edit, keybinding?: number) => {
        if(validateEditor(editor)){
            removeEmptyLines(editor, true, keybinding);
        }
    });

    let alignSelectionBySpacesCommand = vscode.commands.registerTextEditorCommand(
        FuturemotionCommandIds.alignSelectionBySpaces, (editor, edit, keybinding?: number) => {
        if(validateEditor(editor)){
            alignSelectionBySpaces(editor, keybinding);
        }
    });

    let compactCSSCommand = vscode.commands.registerTextEditorCommand(
        FuturemotionCommandIds.compactCSSSelected, (editor, edit, keybinding?: number) => {
        if(validateEditor(editor)){
            compactCSS(editor, keybinding);
        }
    });

    let expandCSSCommand = vscode.commands.registerTextEditorCommand(
        FuturemotionCommandIds.expandCSSSelected, (editor, edit, keybinding?: number) => {
        if(validateEditor(editor)){
            expandCSS(editor, keybinding);
        }
    });

    let wrapPowershellArraySpecifiedCommand = vscode.commands.registerTextEditorCommand(
        FuturemotionCommandIds.wrapPowershellArraySpecified, (editor, edit, keybinding?: number) => {
        if (validateEditor(editor)) {
            wrapPowershellArray(editor, PowershellArrayWrapMode.Specified, keybinding);
        }
    });

    let wrapPowershellArrayConfigCommand = vscode.commands.registerTextEditorCommand(
        FuturemotionCommandIds.wrapPowershellArrayConfig, (editor, edit, keybinding?: number) => {
        if (validateEditor(editor)) {
            wrapPowershellArray(editor, PowershellArrayWrapMode.Configured, keybinding);
        }
    });

    let wrapPowershellArrayFirstRulerCommand = vscode.commands.registerTextEditorCommand(
        FuturemotionCommandIds.wrapPowershellArrayFirstRuler, (editor, edit, keybinding?: number) => {
        if (validateEditor(editor)) {
            wrapPowershellArray(editor, PowershellArrayWrapMode.FirstRuler, keybinding);
        }
    });

    context.subscriptions.push(removeLinebreaksCommand);
    context.subscriptions.push(removeEmptyLinesInDocumentCommand);
    context.subscriptions.push(removeEmptyLinesInSelectedCommand);
    context.subscriptions.push(alignSelectionBySpacesCommand);
    context.subscriptions.push(compactCSSCommand);
    context.subscriptions.push(expandCSSCommand);
    context.subscriptions.push(wrapPowershellArraySpecifiedCommand);
    context.subscriptions.push(wrapPowershellArrayConfigCommand);
    context.subscriptions.push(wrapPowershellArrayFirstRulerCommand);
}

export function deactivate() {}
