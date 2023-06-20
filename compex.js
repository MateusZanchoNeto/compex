const vscode = require('vscode');
const path = require('path');
const compexConfig = require(path.resolve(__dirname, 'compexConfig'));
const compexOptions = compexConfig.compexOptions;
const serversToCompile = compexConfig.serversToCompile;
const configurationValues = compexConfig.configurationValues;

module.exports = compex;

async function compex(context) {

  const lastCommands = getLastCommands(context);

  if (lastCommands) {
    
    const recompile = await vscode.window.showQuickPick(['Recompile', 'New Project', 'List Commands'], {
      canPickMany: false,
      title: 'Recompile: "' + lastCommands[0] + '"?',
    });

    if (!recompile) return;

    if (recompile === 'Recompile') {
      runTerminalCommand(lastCommands[0], context);
      return;
    }

    if (recompile === 'List Commands') {
      console.log(lastCommands);
      const recompileCommand = await selectCommandRecompile(lastCommands);
      if (!recompileCommand) return;

      runTerminalCommand(recompileCommand, context);
      return;
    }

  }

  const project = await getInputText('Project to compile', 'file.mkp', currentRelativeFileName());

  if (!project) return;

  const selectedOptions = await selectOptions();
  if (!selectedOptions) return;

  const serverToCompile = await selectServerToCompile();
  if (!serverToCompile) return;

  let userInput;
  let defaultInput;

  if (selectedOptions) {
    for (let i = 0; selectedOptions.length > i; i++) {

      if (selectedOptions[i] === '-ex') {

        defaultInput = currentFileName().split('\\').pop().slice(0, -4);
        userInput = await getInputText('Executable name', 'executable', defaultInput);

        if (userInput) { 
          selectedOptions[i] = '-ex ' + userInput;
          selectedOptions[i] = selectedOptions[i].trim();
        } else {
          return;
        }
      }
  
      if (selectedOptions[i] === '-v') {

        defaultInput = currentFileName().split('\\').find(folder => folder.match(/^.*BE/));
        userInput = await getInputText('Version', 'version', defaultInput);

        if (userInput) {
          selectedOptions[i] = '-v ' + userInput || defaultInput;
          selectedOptions[i] = selectedOptions[i].trim();
        } else {
          return;
        }
      }
  
      if (selectedOptions[i] === '-scp') {
        
        let scpConfig = await selectSCPConfiguration();
        if (!scpConfig) return;

        scpConfig = configurationValues.scp.find(item => item.name === scpConfig);
        
        selectedOptions[i] = '-scp ' + configurationValuesScpParams(scpConfig);
        selectedOptions[i] = selectedOptions[i].trim();
      }

      if (selectedOptions[i] === '-lcp') {
        selectedOptions[i] = configurationValues.lcp.value;
        selectedOptions[i] = selectedOptions[i].trim();
      }

    }
  }

  if (project && selectedOptions && serverToCompile) {
    runCompexCommand(project, selectedOptions, serverToCompile, context);
  }

}

async function selectOptions() {

	const selectedOptions = await vscode.window.showQuickPick(compexOptions, {
    canPickMany: true,
    placeHolder: 'Select the compex options',
    title: 'Compex: Options',
  });

  return selectedOptions;
}

function runCompexCommand(project, selectedOptions, serverToCompile, context) {

  let command = "compex "

  serverToCompile = serverToCompile || 'loc';
  serverToCompile = serverToCompile.slice(0, 3);

  command += project;

  if (!(serverToCompile === 'loc')) {
    command += ' -d ' + serverToCompile;
  }

  if (selectedOptions) {
    command += ' ' + selectedOptions.join(' ');
  }

  runTerminalCommand(command, context);

}

async function selectServerToCompile() {

	const selectedServer = await vscode.window.showQuickPick(serversToCompile, {
    canPickMany: false,
    placeHolder: 'Select the server to compile',
    title: 'Compex: Server to compile',
  });

  return selectedServer;
}

async function selectSCPConfiguration() {

	const scpConfig = await vscode.window.showQuickPick(configurationValues.scp.map(item => item.name), {
    canPickMany: false,
    placeHolder: 'Select the scp configuration',
    title: 'Compex: scp configuration',
  });

  return scpConfig;
}

async function selectCommandRecompile(lastCommands) {

	const command = await vscode.window.showQuickPick(lastCommands, {
    canPickMany: false,
    placeHolder: 'Command to recompile',
    title: 'Compex: List of last commands',
  });

  return command;
}

async function getInputText(prompt, placeHolder, value) {

  const userInput = await vscode.window.showInputBox({
    prompt,
    placeHolder,
    value,
    title: 'Compex: ' + prompt,
  });

  return userInput;
}

function currentFileName() {
  const file = vscode.window.activeTextEditor;

  if (file && file.document.fileName.slice(-4) === '.mkp') {
    return file.document.fileName;
  }

  return '';
}

function currentRelativeFileName() {
  const file = vscode.window.activeTextEditor;
  
  if (file) {

    const relativePath = vscode.workspace.asRelativePath(file.document.uri)
    
    if (file && file.document.fileName.slice(-4) === '.mkp') {
      return relativePath;
    }
    
  }

  return '';
}

function configurationValuesScpParams(scpConfig) {
  
  let scpParams = '';

  scpParams += scpConfig.user.trim();
  scpParams += '\\';

  scpParams += scpConfig.password.trim();
  scpParams += '\\';;

  scpParams += scpConfig.serverIP.trim();
  scpParams += '\\';;

  scpParams += scpConfig.serverDirectory.trim();
  
  return scpParams;
}

function runTerminalCommand(command, context) {
 
  let terminal = vscode.window.activeTerminal;
  let lastCommands = getLastCommands(context);

  if (!terminal) {
    terminal = vscode.window.createTerminal('compexTerminal');
  }

  terminal.show();

  terminal.sendText(command);

  if (!lastCommands || (lastCommands.length > 0 && lastCommands[0] !== command) ) {
    
    if (!lastCommands) {
      lastCommands = [];
    }

    lastCommands.unshift(command);
    
    if (lastCommands.length > 10) {
      lastCommands.pop();
    }

    setLastCommands(context, lastCommands);
  }

}

function getLastCommands(context) {
  
  let lastCommands = context.globalState.get('compex.lastCompilationCommands');
  
  if (lastCommands) {
    lastCommands = lastCommands.filter(item => (typeof item) === 'string');
  }

  return lastCommands;
}

function setLastCommands(context, lastCommands) {
  context.globalState.update('compex.lastCompilationCommands', lastCommands);
}