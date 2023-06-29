const vscode = require('vscode');
const path = require('path');
const compex = require(path.resolve(__dirname, 'compex'));
const userCommands = require(path.resolve(__dirname, 'userCommands'));

function activate(context) {

	let compexCompilation = vscode.commands.registerCommand('compex.compilation', () => compex(context) );
	let compexUserCommands = vscode.commands.registerCommand('compex.userCommands', () => userCommands() );

	context.subscriptions.push(compexCompilation);
	context.subscriptions.push(compexUserCommands);

}

function deactivate() {}

module.exports = {
	activate,
	deactivate
}
