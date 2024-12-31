// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Extension "hltodos" is now active!');

	// Define the comment patterns to highlight
    const patterns = {
        fix: {
            pattern: 'FIX',
            type: new vscode.ThemeColor('errorForeground')
        },
        fixme: {
            pattern: 'FIXME',
            type: new vscode.ThemeColor('errorForeground')
        },
        hack: {
            pattern: 'HACK',
            type: new vscode.ThemeColor('editorWarning.foreground')
        },
        note: {
            pattern: 'NOTE',
            type: new vscode.ThemeColor('testing.iconPassed')
        },
        perf: {
            pattern: 'PERF',
            type: new vscode.ThemeColor('terminal.ansiMagenta')
        },
        todo: {
            pattern: 'TODO',
            type: new vscode.ThemeColor('textLink.foreground')
        },
        warn: {
            pattern: 'WARN',
            type: new vscode.ThemeColor('editorWarning.foreground')
        },
        warning: {
            pattern: 'WARNING',
            type: new vscode.ThemeColor('editorWarning.foreground')
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

	let timeout: NodeJS.Timeout | undefined = undefined;

	function triggerUpdateDecorations() {
		console.log('triggerUpdateDecorations()')
        if (timeout) {
            clearTimeout(timeout);
            timeout = undefined;
        }
        timeout = setTimeout(updateDecorations, 500);
    }

	function updateDecorations() {
		console.log('updateDecations()')
        const activeEditor = vscode.window.activeTextEditor;
        if (!activeEditor) {
            return;
        }

        const visibleRanges = activeEditor.visibleRanges;
        const document = activeEditor.document;

        // Initialize decoration arrays for each pattern
        const decorationsArray: { [key: string]: vscode.DecorationOptions[] } = {};
        Object.keys(patterns).forEach(key => {
            decorationsArray[key] = [];
        });

        // Only process text in visible ranges for performance
        for (const visibleRange of visibleRanges) {
            const text = document.getText(visibleRange);
            const lines = text.split('\n');
            let lineOffset = document.positionAt(document.offsetAt(visibleRange.start)).line;

            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];

                // Only process if the line contains a comment
                if (true) {
                    Object.entries(patterns).forEach(([key, value]) => {
                        let index = 0;
                        while ((index = line.indexOf(value.pattern, index)) !== -1) {
                            // Verify we're in a comment
                            const isInComment = true

                            if (isInComment) {
                                const range = new vscode.Range(
                                    new vscode.Position(lineOffset + i, index),
                                    new vscode.Position(lineOffset + i, index + value.pattern.length)
                                );

								console.log(line)
								console.log(range)
                                decorationsArray[key].push({ range });
                            }
                            index += value.pattern.length;
                        }
                    });
                }
            }
        }

        // Apply decorations
        Object.entries(decorationTypes).forEach(([key, decorationType]) => {
			console.log(key)
            activeEditor.setDecorations(decorationType, decorationsArray[key]);
        });
    }

    let activeEditor = vscode.window.activeTextEditor;
    if (activeEditor) {
        triggerUpdateDecorations();
    }

	// Register event handlers
    vscode.window.onDidChangeActiveTextEditor(editor => {
        activeEditor = editor;
        if (editor) {
            triggerUpdateDecorations();
        }
    }, null, context.subscriptions);

    vscode.workspace.onDidChangeTextDocument(event => {
        if (activeEditor && event.document === activeEditor.document) {
            triggerUpdateDecorations();
        }
    }, null, context.subscriptions);

    vscode.window.onDidChangeTextEditorVisibleRanges(event => {
        if (activeEditor && event.textEditor === activeEditor) {
            triggerUpdateDecorations();
        }
    }, null, context.subscriptions);

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('hltodos.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from hltodos!');
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
