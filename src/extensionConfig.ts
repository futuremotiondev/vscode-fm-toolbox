import { TextDocument, workspace } from 'vscode';
import { Constants } from './extension';

export interface ExtensionConfig {
    allowedNumberOfEmptyLines: number;
    powershellArrayWrapWidth: number;
}

export function getExtensionConfig(document?: TextDocument): ExtensionConfig {
    let allowedNumberOfEmptyLines = 0;
    let powershellArrayWrapWidth = 100;

    const config = workspace.getConfiguration(undefined, document).get(Constants.ExtensionPrefix) as ExtensionConfig;
    if (!config) {
        return {
            allowedNumberOfEmptyLines,
            powershellArrayWrapWidth
        };
    }
    if (config.allowedNumberOfEmptyLines >= 0 && config.allowedNumberOfEmptyLines <= 100) {
        allowedNumberOfEmptyLines = config.allowedNumberOfEmptyLines;
    }
    if (config.powershellArrayWrapWidth >= 40 && config.powershellArrayWrapWidth <= 300) {
        powershellArrayWrapWidth = config.powershellArrayWrapWidth;
    }
    return {
        allowedNumberOfEmptyLines,
        powershellArrayWrapWidth
    };
}