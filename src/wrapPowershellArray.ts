import { Range, TextDocument, TextEditor, window, Position } from 'vscode';
import { getExtensionConfig } from './extensionConfig';
import { getDefinedRulers } from './util';
import { PowershellArrayWrapMode } from './extension';

export async function wrapPowershellArray(editor: TextEditor, mode: string, keybindingsPassedPowershellArrayWrapWidth?: unknown) {
    const $config = getExtensionConfig(editor.document);
	if (typeof keybindingsPassedPowershellArrayWrapWidth === 'number') {
        if (mode == 'Configured') {
		    $config.powershellArrayWrapWidth = keybindingsPassedPowershellArrayWrapWidth;
        }
	}

    let maxWidth: number = $config.powershellArrayWrapWidth;
    if (mode === PowershellArrayWrapMode.Specified) {
        let validInput = false;
        while (!validInput) {
            const input = await window.showInputBox({
                prompt: 'Enter the maximum character width for array wrapping. Valid Range is 40-400.',
                validateInput: (value) => {
                    const numValue = Number(value);
                    if (isNaN(numValue)) { return 'Please enter a valid number'; }
                    if (numValue < 40 || numValue > 400) { return 'Number must be between 40 and 400'; }
                    return null;
                }
            });

            if (input !== undefined) {
                const numValue = Number(input);
                if (numValue >= 40 && numValue <= 400) {
                    maxWidth = numValue;
                    validInput = true;
                }
            } else {
                // If the user cancels the input box, exit the function
                return;
            }
        }
    }
    else if(mode === PowershellArrayWrapMode.FirstRuler){
        const rulers = getDefinedRulers(editor.document);
        if (rulers.length > 0) {
            maxWidth = rulers[0].column;
        }
        else{
            window.showErrorMessage('No rulers are defined.');
            return;
        }
    }

    // Get the document and selection
    const document = editor.document;
    const selection = editor.selection;

    // Find the array boundaries
    const arrayBounds = findArrayBoundaries(document, selection.active.line);
    if (!arrayBounds) {
        window.showErrorMessage('No PowerShell array found at cursor position');
        return;
    }

    const [startLine, endLine] = arrayBounds;

    // Extract array content
    const arrayText = document.getText(new Range(
        new Position(startLine, 0),
        new Position(endLine + 1, 0)
    ));

    // Process the array
    const formattedArray = formatPowershellArray(arrayText, maxWidth);

    // Replace the text
    await editor.edit(editBuilder => {
        editBuilder.replace(
            new Range(
                new Position(startLine, 0),
                new Position(endLine + 1, 0)
            ),
            formattedArray
        );
    });
}

function findArrayBoundaries(document: TextDocument, currentLine: number): [number, number] | null {
    let startLine = currentLine;
    let endLine = currentLine;
    const lineCount = document.lineCount;

    // Search upward for array start
    while (startLine >= 0) {
        const line = document.lineAt(startLine).text.trim();
        if (line.match(/\$\w+\s*=\s*@\(/)) {
            break;
        }
        if (startLine === 0) {
            return null;
        }
        startLine--;
    }

    // Search downward for array end
    while (endLine < lineCount) {
        const line = document.lineAt(endLine).text.trim();
        if (line === ')') {
            break;
        }
        if (endLine === lineCount - 1) {
            return null;
        }
        endLine++;
    }

    return [startLine, endLine];
}

function formatPowershellArray(arrayText: string, maxWidth: number): string {
    // Extract variable name and array items
    const matches = arrayText.match(/(\$\w+\s*=\s*@\()([^)]+)(\))/s);
    if (!matches) {
        return arrayText;
    }

    const [_, arrayDeclaration, content] = matches;

    // Parse array items - now handling both single-line and multi-line formats
    const items = content
        .split('\n')
        .map(line => line.trim())
        .join(' ')  // Join all lines
        .split(',') // Split by commas
        .map(item => item.trim())
        .filter(item => item.length > 0); // Remove empty items

    // Format the array
    let result = arrayDeclaration + '\n';
    let currentLine = '    ';

    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const isLast = i === items.length - 1;
        const itemText = isLast ? item : item + ',';

        if (currentLine.length + itemText.length + 1 > maxWidth) {
            result += currentLine.trimEnd() + '\n';
            currentLine = '    ';
        }

        currentLine += itemText + ' ';

        if (i === items.length - 1) {
            result += currentLine.trimEnd();
        }
    }

    return result + '\n)';
}