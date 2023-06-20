const vscode = require('vscode');
const path = require('path');
const compex = require(path.resolve(__dirname, 'compex'));

function activate(context) {

	let compexCompilation = vscode.commands.registerCommand('compex.compilation', () => compex(context) );

	context.subscriptions.push(compexCompilation);

}

function deactivate() {}

module.exports = {
	activate,
	deactivate
}
