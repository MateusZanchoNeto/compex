const vscode = require('vscode');

const configurationValues = compexConfigurationValues();
const compexOptions = returnCompexOptions();

const serversToCompile = [
  "222 - ubuntu  - Ubuntu  - Harbour Ubuntu",
  "223 - frente  - Cent-OS - xHarbour [Frente]",
  "230 - xhb     - Cent-OS - xHarbour",
  "231 - x64     - Cent-OS - Harbour 64",
  "232 - ubuntu2 - Ubuntu  - Harbour Ubuntu",
  "233 - x86     - Cent-OS - Harbour 32",
  "local",
];

function scpConfigurationValues() {
  const configuration = vscode.workspace.getConfiguration();
  let scpConfiguration = configuration.get("compex.scp");
  scpConfiguration = scpConfiguration.filter(item => item.name.trim() !== '' && item.user.trim() !== '' && item.password.trim() !== '' && item.serverIP.trim() !== '' && item.serverDirectory.trim() !== '' );
  return scpConfiguration;
}

function returnCompexOptions() {

  const compexOptions = [];
  const scpConfiguration = scpConfigurationValues();

  if (scpConfiguration && scpConfiguration.length > 0) {
    compexOptions.push(`-scp`);
  }

  for (let key in configurationValues.options) {
    if (configurationValues.options[key]["value"]) {
      compexOptions.push(configurationValues.options[key]["param"]);
    }
  }

  if (configurationValues.lcp.enabled) {
    compexOptions.push(configurationValues.lcp.param);
  }

  return compexOptions;
}

function compexConfigurationValues() {
  const configuration = vscode.workspace.getConfiguration();
  return {
    scp: scpConfigurationValues(),
    lcp: {
      enabled: configuration.get("compex.options.lcp")? true : false,
      param: '-lcp',
      value: '-lcp ' + configuration.get("compex.options.lcp"),
    },
    options: {
      noExport: {
        value: configuration.get("compex.options.noExport"),
        param: '-noexport'
      },
      noUpdate: {
        value: configuration.get("compex.options.noUpdate"),
        param: '-noupdate'
      },
      automatic: {
        value: configuration.get("compex.options.automatic"),
        param: '-auto'
      },
      batch: {
        value: configuration.get("compex.options.batch"),
        param: '-batch'
      },
      executableName: {
        value: configuration.get("compex.options.executableName"),
        param: '-ex'
      },
      version: {
        value: configuration.get("compex.options.version"),
        param: '-v'
      },
      rebuild: {
        value: configuration.get("compex.options.rebuild"),
        param: '-r'
      },
      quiet: {
        value: configuration.get("compex.options.quiet"),
        param: '-q'
      },
      sqlrdd: {
        value: configuration.get("compex.options.sqlrdd"),
        param: '-s'
      },
      xharbour: {
        value: configuration.get("compex.options.xharbour"),
        param: '-xh'
      },
      fivewin: {
        value: configuration.get("compex.options.fivewin"),
        param: '-fw'
      },
      harbourARM: {
        value: configuration.get("compex.options.harbourArm"),
        param: '-arm'
      },
      harbourx84: {
        value: configuration.get("compex.options.harbourx86"),
        param: '-x86'
      },
      harbourx64: {
        value: configuration.get("compex.options.harbourx64"),
        param: '-x64'
      },
      trunk2: {
        value: configuration.get("compex.options.trunk2"),
        param: '-trunk2'
      },
      ezexport: {
        value: configuration.get("compex.options.ezexport"),
        param: '-ezexport'
      },
      ftp: {
        value: configuration.get("compex.options.ftp"),
        param: '-ftp'
      },
      run: {
        value: configuration.get("compex.options.run"),
        param: '-run'
      }
    }
  };
}

module.exports = {
  compexOptions,
  configurationValues,
  serversToCompile,
}
