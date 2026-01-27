// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated

	// Define the comment patterns to highlight
    const patterns = {
        fix: {
            pattern: 'FIX:',
            type: new vscode.ThemeColor('terminal.ansiRed')
        },
        fixme: {
            pattern: 'FIXME:',
            type: new vscode.ThemeColor('terminal.ansiRed')
        },
        hack: {
            pattern: 'HACK:',
            type: new vscode.ThemeColor('terminal.ansiYellow')
        },
        note: {
            pattern: 'NOTE:',
            type: new vscode.ThemeColor('terminal.ansiGreen')
        },
        info: {
            pattern: 'INFO:',
            type: new vscode.ThemeColor('terminal.ansiWhite')
        },
        perf: {
            pattern: 'PERF:',
            type: new vscode.ThemeColor('terminal.ansiMagenta')
        },
        todo: {
            pattern: 'TODO:',
            type: new vscode.ThemeColor('terminal.ansiBlue')
        },
        warn: {
            pattern: 'WARN:',
            type: new vscode.ThemeColor('terminal.ansiYellow')
        },
        warning: {
            pattern: 'WARNING:',
            type: new vscode.ThemeColor('terminal.ansiYellow')
        },
    };

	// Create decorations for each pattern
    const decorationTypes = Object.fromEntries(
        Object.entries(patterns).map(([key, value]) => [
            key,
            vscode.window.createTextEditorDecorationType({
                backgroundColor: value.type,
				color: new vscode.ThemeColor('editor.background'),
				fontWeight: 'bold',
				borderRadius: '2px',
				rangeBehavior: vscode.DecorationRangeBehavior.ClosedClosed,
            })
        ])
    );

	let updateTimeout: NodeJS.Timeout | undefined;

	function triggerUpdateDecorations() {
		if (updateTimeout) {
			clearTimeout(updateTimeout);
		}
		updateTimeout = setTimeout(updateDecorations, 100);
	}

    function updateDecorations() {
        const visibleEditors = vscode.window.visibleTextEditors;

        for (const editor of visibleEditors) {
            const document = editor.document;

            // Initialize decoration arrays for each pattern
            const decorationsArray: { [key: string]: vscode.DecorationOptions[] } = {};
            Object.keys(patterns).forEach(key => {
                decorationsArray[key] = [];
            });

            // Process all text in the document instead of just visible ranges
            const text = document.getText();
            const lines = text.split('\n');

            for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
                const line = lines[lineIndex];

                Object.entries(patterns).forEach(([key, value]) => {
                    let index = 0;
                    while ((index = line.indexOf(value.pattern, index)) !== -1) {
                        const range = new vscode.Range(
                            new vscode.Position(lineIndex, index),
                            new vscode.Position(lineIndex, index + value.pattern.length)
                        );

                        decorationsArray[key].push({ range });
                        index += value.pattern.length;
                    }
                });
            }

            // Apply decorations for this editor
            Object.entries(decorationTypes).forEach(([key, decorationType]) => {
                editor.setDecorations(decorationType, decorationsArray[key]);
            });
        }
    }

    triggerUpdateDecorations();

    // Update the event handlers to handle multiple editors
    vscode.window.onDidChangeVisibleTextEditors(() => {
        triggerUpdateDecorations();
    }, null, context.subscriptions);

    vscode.workspace.onDidChangeTextDocument(event => {
        if (vscode.window.visibleTextEditors.some(editor => editor.document === event.document)) {
            triggerUpdateDecorations();
        }
    }, null, context.subscriptions);
}

// This method is called when your extension is deactivated
export function deactivate() {}
