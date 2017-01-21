// Load in dependencies
var _        = require('underscore');
var program  = require('commander');
var pkg      = require('../../package.json');

// Define CLI parser
exports.parse = function (argv) {
  // Handle CLI arguments
  program
    .version(pkg.version)
    .option('-S, --skip-taskbar', 'Skip showing the application in the taskbar')
    .option('--minimize-to-tray', 'Hide window to tray instead of minimizing')
    .option('--hide-via-tray', 'Hide window to tray instead of minimizing (only for tray icon)')
    .option('--allow-multiple-instances', 'Allow multiple instances of `Fuzium` to run')
    .option('--verbose', 'Display verbose log output in stdout')
    // Allow unknown Chromium flags
    .allowUnknownOption();

  // Specify keys that can be used by config if CLI isn't provided
  var cliConfigKeys = ['skip-taskbar', 'minimize-to-tray', 'hide-via-tray', 'allow-multiple-instances'];
  var cliInfo = _.object(cliConfigKeys.map(function generateCliInfo (key) {
    return [key, _.findWhere(program.options, {long: '--' + key})];
  }));

  // Process arguments
  program.parse(argv);

  // Amend cliConfigKeys and cliInfo as attributes
  program._cliConfigKeys = cliConfigKeys;
  program._cliInfo       = cliInfo;

  // Return parsed info
  return program;
};
