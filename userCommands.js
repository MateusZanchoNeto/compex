const vscode = require('vscode');
module.exports = userCommands;

async function userCommands() {
    
    const userCommandsList = vscode.workspace.getConfiguration().get("compex.userCommandsList");

    if (!userCommandsList || (userCommandsList.length === 1 && (!userCommandsList[0] || !userCommandsList[0].name))) {
        vscode.window.showInformationMessage('No user commands found. Please add them to your settings.json file.');
        return;
    }

    const commandName = await vscode.window.showQuickPick(userCommandsList.filter(item => item.hasOwnProperty('name') && item.hasOwnProperty('command')).map(item => item.name), {
        canPickMany: false,
        placeHolder: '',
        title: 'Compex: User Commands',
    });
    
    if (!commandName) return;
    
    let command = userCommandsList.find(item => item.name === commandName).command;

    if (!command) return;
    
    runTerminalCommand(command);

}

function runTerminalCommand(command) {
 
    let terminal = vscode.window.activeTerminal;
  
    if (!terminal) {
      terminal = vscode.window.createTerminal('compexTerminal');
    }
  
    terminal.show();
  
    terminal.sendText(command);
  
}