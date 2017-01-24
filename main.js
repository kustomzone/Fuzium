'use strict';

///////////////////// Zeronet ///////////////////

// loads Zeronet default homepage
var HelloZeronet = 'http://127.0.0.1:43110/';

///////////////////// Electron ///////////////////
const { electron, app, crashReporter, globalShortcut, ipcMain, protocol, remote,
   BrowserWindow, Menu, MenuItem, Tray } = require('electron');

const electronLocalshortcut = require('electron-localshortcut');

global.sharedObject = { prop1: process.argv }

// Constants
const fs         = require('fs');
const os         = require('os');
const url        = require('url');
const path       = require('path');
const dir        = require('node-dir');

// Dependencies
var _            = require('underscore');
var _exist       = require("is-there");
var program      = require('commander');
var monogamous   = require('monogamous');
var Configstore  = require('configstore');
var spawn        = require('electron-spawn');

// Release dependencies
// (include in installer as still adding defaults)
const devtools = require('electron-devtools-installer');

// Other
const spawnChild   = require('child_process').spawn;
const ChildProcess = require('child_process');

// Utils
var appLogger    = require('./js/logger');
var appMenu      = require('./js/menu');
var appTray      = require('./js/tray');
var appIcons     = require('./gfx/icons');

// Multiplatform menus
// var menuTemplate = require('./js/menus/' + process.platform + '.json');

// Set history data
var historyPath    = app.getPath('userData') + '/userdata/history.json';
var extensionsPath = app.getPath('userData').replace(/\\/g, '/') + '/userdata/extensions';
var userdataPath   = app.getPath('userData') + '/userdata';
var configPath     = app.getPath("userData") + "/personal.config";

// Load app info
var pkg = require('./package.json');


// Define config constructor
function Config(cliOverrides, cliInfo) {
  
  // Create config
  this.config = new Configstore(pkg.name, {
    'playpause-shortcut': 'mediaplaypause',
    'next-shortcut':      'medianexttrack',
    'previous-shortcut':  'mediaprevioustrack'
  });
  this.cliOverrides = cliOverrides;

  // Generate IPC bindings for config and its info
  var that = this;
  ipcMain.on('get-config-sync', function handleGetConfigSync (evt) {
    evt.returnValue = JSON.stringify(that.getAll());
  });
  ipcMain.on('get-config-info-sync', function handleGetConfigInfoSync (evt) {
    evt.returnValue = JSON.stringify(cliInfo);
  });
  ipcMain.on('get-config-overrides-sync', function handleGetConfigInfoSync (evt) {
    evt.returnValue = JSON.stringify(cliOverrides);
  });
  ipcMain.on('set-config-item-sync', function handleSetConfigItemSync (evt, key, val) {
    that.set(key, val);
    evt.returnValue = JSON.stringify({success: true});
  });
}

// Key configs
Config.prototype = {
  getAll: function () {
    return _.defaults({}, this.cliOverrides, this.config.all);
  },
  get: function (key) {
    var all = this.getAll();
    return all[key];
  },
  set: function (key, val) {
    return this.config.set(key, val);
  },
  del: function (key) {
    return this.config.del(key);
  },
  clear: function () {
    return this.config.clear();
  }
};

// Check configs
if (fs.existsSync(configPath)) {
  var configs = require(configPath);
  
  if (typeof configs === "object") {
    configs = JSON.stringify(configs);
    configs = JSON.parse(configs);
	
    if (configs.enable_proxy) {
      for (var key in configs.proxy) {
        if (configs.proxy.hasOwnProperty(key) && configs.proxy[key]) {
          app.commandLine.appendSwitch("proxy-" + key, configs.proxy[key]);
        }
      }
    }
  }
}

// Define CLI parser
program
  .version(pkg.version)
  .option('-S, --skip-taskbar', 'Skip showing the application in the taskbar')
  .option('--minimize-to-tray', 'Hide window to tray instead of minimizing')
  .option('--hide-via-tray',    'Hide window to tray instead of minimizing (only for tray icon)')
  .option('--allow-multiple-instances', 'Allow multiple instances of `Fuzium` to run')
  .option('--verbose', 'Display verbose log output in stdout')
  .allowUnknownOption(); // Allow unknown Chromium flags

// Specify keys that can be used by config if CLI isn't provided
var cliConfigKeys = ['skip-taskbar', 'minimize-to-tray', 'hide-via-tray', 'allow-multiple-instances'];
var cliInfo = _.object(cliConfigKeys.map(function generateCliInfo (key) {
  return [key, _.findWhere(program.options, {long: '--' + key})];
}));

// Generate a logger
var logger = appLogger({ verbose: program.verbose + '' }); // adding a '' activates debug logging.

console.log(''); // spacer

// Amend attributes
program._cliConfigKeys = cliConfigKeys;
program._cliInfo       = cliInfo;

// Check camelcase
function camelcase(flag) {
  return flag.split('-').reduce(function (str, word) {
	return str + word[0].toUpperCase() + word.slice(1);
  });
}

// CLI config defaults
var cliConfig = _.object(program._cliConfigKeys.map(function getCliValue (dashCaseKey) {
  var camelCaseKey = camelcase(dashCaseKey);
  return [dashCaseKey, program[camelCaseKey]];
}));

// Generate config based on CLI arguments
// logger.debug('CLI options overriding config \n', cliConfig, '\n');
var config = new Config(cliConfig, program._cliInfo, '\n');
logger.debug('Config options \n', config.getAll(), '\n');


////////////// Window ready ////////////////
app.on('ready', function() {
	
	if (booter) {
		booter.boot();
	} else {
		startApp();
	}

});

// Windows are closed
app.on('window-all-closed', function() {
	if (process.platform != 'darwin') { 
	  app.quit();
	}
});

var windows_built = false;
var open_url;

// Open URL
app.on("open-url", function(event, url) {
  event.preventDefault();
  open_url = url;
  console.log(open_url);
  if (windows_built) {
    add_open_url_tab(url);
  }
});

//////////// Functions for main window ////////////
var logo = appIcons['logo'];
// var datetime = new Date();

let func = {
  browserWindow: null,
  config: config,
  logger: logger,
  openAboutWindow: function () {
	var info = [
	  '<style type="text/css">',
      'body { background: #252020; color: #E0C0C0; font-family: "Arial", "sans-serif"; }',
	  'p { color: orange; }',
      '</style>',
	  '<div style="text-align: center; font-family: \'Helvetica Neue\', \'Arial\', \'sans-serif\'">',
		'<h3>About</h3>',
		'<p>',
		  'Version: ' + pkg.version,
		  '<br/>',
		  'Electron version: ' + process.versions.electron,
		  '<br/>',
		  'Node.js version: ' + process.versions.node,
		  '<br/>',
		  'Chromium version: ' + process.versions.chrome,
		'</p>',
		'<p>App: <script>document.write(require(\'electron\').remote.process.argv)</script></p>',
		'<br>',
		'<img src="' + logo + '">',
	  '</div>'
	].join('');
	
	var aboutWindow = new BrowserWindow({
	  title: 'About',
	  width:  480,
	  height: 340,
	  autoHideMenuBar: true,
	  titleBarStyle: 'hidden-inset',
	  icon: appIcons['info-32']
	});
	aboutWindow.loadURL('data:text/html,' + info);
	logger.debug('Show app info');
  },
  // Config window
  openConfigWindow: function () {
	var configWindow = new BrowserWindow({
	  title:  'Prefs',
	  width:  620,
	  height: 330,
	  autoHideMenuBar: true,
	  titleBarStyle: 'hidden-inset',
	  icon: appIcons['info-32']
	});
	// Load config options
	var configPage = __dirname + '/js/config.htm';
	configWindow.loadURL(configPage);
	logger.debug('Show config; ' + configPage);
  },
  
  // Quit application
  quitApplication: function () {
	logger.debug('Exiting');
	app.quit();
  },
  
  // Reload
  reloadWindow: function () {
	logger.debug('Reloading');
	BrowserWindow.getFocusedWindow().reload();
  },
  
  // Show views
  showMinimizedWindow: function () {
	// (focus is necessary when there is no taskbar and we have lost focus for the app)
	func.browserWindow.restore();
	func.browserWindow.focus();
	logger.debug('Browser focus');
  },
  showInvisibleWindow: function () {
	func.browserWindow.show();
  },
  
  // Toggle devtools
  toggleDevTools: function () {
	logger.debug('Toggle developer tools');
	BrowserWindow.getFocusedWindow().toggleDevTools();
  },
  
  // Toggle fullscreen
  toggleFullScreen: function () {
	var focusedWindow = BrowserWindow.getFocusedWindow();
	// Move to other full screen state (e.g. true -> false)
	var wasFullScreen = focusedWindow.isFullScreen();
	var toggledFullScreen = !wasFullScreen;
	logger.debug('Toggle focused window size; \n', {
	  wasFullScreen: wasFullScreen,
	  toggledFullScreen: toggledFullScreen
	});
	focusedWindow.setFullScreen(toggledFullScreen);
  },
  
  // Toggle minimize
  toggleMinimize: function () {
	if (func.browserWindow) {
	  var isMinimized = func.browserWindow.isMinimized();
	  logger.debug('Toggle browser window minimization', {
		isMinimized: isMinimized
	  });
	  if (isMinimized) {
		func.showMinimizedWindow();
	  } else {
		func.browserWindow.minimize();
	  }
	} else {
	  logger.debug('Window minimization toggle requested but browser window not found');
	}
  },
  
  // Toggle visibility
  toggleVisibility: function () {
	if (func.browserWindow) {
	  var isVisible = func.browserWindow.isVisible();
	  logger.debug('Toggling browser window visibility', {
		isVisible: isVisible
	  });
	  if (isVisible) {
		func.browserWindow.hide();
	  } else {
		func.showInvisibleWindow();
	  }
	} else {
	  logger.debug('Window visibility toggle requested but browser window not found');
	}
  }
};

// Create userdata paths if none exist
checkPaths();

function checkPaths() {
    //check if directory called userdata exists
    if (!_exist(userdataPath)) {
        fs.mkdir(userdataPath);
    }
    //check if directory called extensions exists
    if (!_exist(extensionsPath)) {
        fs.mkdir(extensionsPath);
    }
    //check if file called history.json exists
    if (!_exist(historyPath)) {
        fs.writeFile(historyPath, '{"history":[]}');
    }
}

// Assign tray click behavior
func.onTrayClick = (config.get('hide-via-tray') || config.get('minimize-to-tray')) ?
  func.toggleVisibility : func.toggleMinimize;

func.onRaise = (config.get('hide-via-tray') || config.get('minimize-to-tray')) ?
  func.showInvisibleWindow : func.showMinimizedWindow;


// If we are only allowing single instances
var booter;

if (!config.get('allow-multiple-instances')) {
  // Start up/connect to a monogamous server (detects other instances)
  booter = monogamous({sock: pkg.name});

  // If we are the first instance, start up func
  booter.on('boot', startApp);

  // Otherwise, focus it
  booter.on('reboot', func.onRaise);

  // If we encounter an error, log it and start anyway
  booter.on('error', function handleError (err) {
	logger.info('Ignoring boot error ' + err + ' while connecting to monogamous server');
	startApp();
  });
}

// Define a truncation utility for tooltip
function truncateStr(str, len) {
  // If the string is over the length then truncate it
  // (go 1 under length so there's room for ellipses)
  if (str.length > len) {
	return str.slice(0, len - 2) + '…';
  }
  return str;
}

///////////////////////// Create Main Window /////////////////////////
function startApp() {
	
	// Load some default Chrome extensions
	/*
	REACT_PERF
	REDUX_DEVTOOLS
	VUEJS_DEVTOOLS
	ANGULARJS_BATARANG
	JQUERY_DEBUGGER
	BACKBONE_DEBUGGER
	REACT_DEVELOPER_TOOLS
	EMBER_INSPECTOR
	+ (zeronetExt)
	*/
	
	// Testing (default)
	devtools.default(devtools.REACT_DEVELOPER_TOOLS)
      .then((name) => console.log(`Added Extension: ${name}` + '\n'))
      .catch((err) => console.log('An error occurred: ', err + '\n'));
	
	// Chrome Zeronet Extension
	// var zeronetExtID = 'cpkpdcdljfbnepgfejplkhdnopniieop';
	// var zeronetExtName = 'ZeroNet Protocol';
	
	// Testing (new default)
	devtools.default(devtools.zeronetExt)
      .then((name) => console.log(`Added Extension: ${name}` + '\n'))
      .catch((err) => console.log('An error occurred: ', err + '\n'));
	
	// Get window info
	var windowInfo = config.get('window-info') || {};
	
	// Set window options
	var windowOpts = {
	  frame:           true,
	  resizable:       true,
	  transparent:	   true,
	  autoHideMenuBar: false,
	  titleBarStyle: 'hidden-inset',
	  height: windowInfo.height || 920,
	  width:  windowInfo.width  || 1024,
	  x: windowInfo.x || null,
	  y: windowInfo.y || null,
	  icon: appIcons['icon-32'],
	  preload: __dirname + '/js/browser.js',
	  title: 'Fuzium'
	};
	
	// Define main browser window
	func.browserWindow = new BrowserWindow(windowOpts);
	// func.browserWindow.loadURL('https://google.com');
	
	// Todo: Set window resizable and focus
	// func.browserWindow.setResizable(true);
	// func.browserWindow.focus();
	
	// Logger info
	logger.info('\n\n App is ready:', {
	  version: pkg.version,
	  platform: process.platform,
	  options: windowOpts,
	  processVersions: process.versions
	});
	
	// Minimize to tray
	if (config.get('minimize-to-tray')) {
	  func.browserWindow.on('minimize', func.toggleVisibility);
	}

	// Save window position after moving
	function saveWindowInfo() {
	  config.set('window-info', func.browserWindow.getBounds());
	}
	func.browserWindow.on('move', _.debounce(function handleWindowMove () {
	  // logger.debug('Browser window moved, saving window info in config.');
	  saveWindowInfo();
	}, 250));

	// Save the window size after resizing
	func.browserWindow.on('resize', _.debounce(function handleWindowResize () {
	  // logger.debug('Browser window resized, saving window info in config.');
	  saveWindowInfo();
	}, 250));

	// When window is closed, clean up the reference to window
	func.browserWindow.on('closed', function handleWindowClose () {
	  logger.debug('Fuzium shutting down.');
	  func.browserWindow = null;
	  if (fuzium) { fusium.kill('SIGINT'); }
	});

  	// Set download folder 
	func.browserWindow.webContents.session.on('will-download', (event, item, webContents) => {
	  // Set the save path, making Electron not to prompt a save dialog
	  item.setSavePath('files/'+item.getFilename());
	 
	  // Track download progress
	  var bytes, dl = 0;
	  item.on('updated', (event, state) => {
		if (state === 'interrupted') {
		  console.log('Download interrupted but can be resumed');
		} else if (state === 'progressing') {
		  if (item.isPaused()) {
			  console.log('Download is paused');
		  } else {
			  dl = parseInt(`${item.getReceivedBytes()}`);
			  if (bytes != dl) {
				  console.log(`Received bytes: ${item.getReceivedBytes()}`)
				  bytes = parseInt(`${item.getReceivedBytes()}`);
			  }
		  }
		}
	  });
	  
	  // Download completed
	  item.once('done', (event, state) => {
		if (state === 'completed') {
			console.log('Completed. Check your app download folder')
		} else {
			console.log(`Download failed: ${state}`)
		}
	  });  
	});
	
	// Init menu & tray
	// Menu.init();
	appMenu.init(func);
	appTray.init(func);
	
	// Timing bootup.
	// Getting Electron's and Zeronet's timing right will depend on each device.
	// Of course Electron should be ready first while Zeronet is booting.
	// Timing is improving as more things get added anyway.
	
	if (func.browserWindow) {
		// Hopefully Zeronet is ready to go after a few of seconds.
		setTimeout(function() { func.browserWindow.loadURL(HelloZeronet); }, 3000);
		
		// But if not, a delayed reload also works fine.
		// setTimeout(function(){ func.browserWindow.reload(); }, 4000);
		
		// For now we'll assume it's loading okay.
		console.log('\n Electron is ready, load Zeronet.. \n');
		
		// But worst case may happen on slow or busy device.
		// Then we might also need Zeronet to inform the browser.
		// So tell the user to reload the app manually...
		
		// console.log('\n Press [CTRL-R] to reload browser.');
		
		// Testing Dev and Release as they behave quite differently!
		// var devOnly  = spawnChild(path.resolve(__dirname + '/bin/ZeroNet.exe'), ['--open_browser', '']);
		// ..or..
		// var forApp   = path.resolve(path.dirname(process.execPath), '..', __dirname + '/bin/ZeroNet.exe');
		// var packaged = spawnChild(forApp, { detached: false } ); // { stdio: 'inherit' }
		
		// (note: our "fuzium.kill" process needs fixing now there's an installer)
		var fuzium = startZeronet();
		// console.log('\n fuzium = ' + fuzium + '\n');
		
		// Spawn Zeronet as child of Electron
		function startZeronet() {
			
			// process.env.PATH
			
			// Check args (mainly for release installer)
			if (process.argv.length === 1) {
				var ZeronetApp = app.getAppPath() + '\\bin\\ZeroNet.exe';
				console.log('Zeronet app: ' + ZeronetApp + '\n');
				// With installer we seem to lose our console even if it's detatched
				return spawn(ZeronetApp, { detached: true } ); // ['--open_browser', '']);
			}
			
			// Show any processes
			for (var i = 0; i < process.argv.length; i++) {
				console.log('process #' + i + ' = ' + process.argv[i]);
			}
			
			// Show paths
			var appName = path.basename(process.execPath)
			console.log('appName = ' + appName + '\n');
			var electronApp = path.resolve(process.execPath);
			console.log('electronApp = ' + electronApp);
			var distFolder  = path.resolve(process.execPath, '..');
			console.log('distFolder = ' + distFolder);
			var appFolder   = path.resolve(distFolder, '..');
			console.log('appFolder = ' + appFolder);
			var ZeronetApp  = path.resolve(path.join(__dirname, '/bin/ZeroNet.exe') );
			console.log('ZeronetApp = ' + ZeronetApp);
			
			// Spawn Zeronet
			return spawnChild( ZeronetApp, ['--open_browser', ''] ); // { detached: false }
			
			// (alternative options)
			// return spawn( ZeronetApp, { detached: true }, ['--open_browser', ''] ); // { detached: false }
			
			// Todo: try to respawn zeronet if closed.
			let respawn = function(command, args) {
				var spawnedProcess, error;
				try {
					spawnedProcess = ChildProcess.spawn(command, args, {detached: false } );
				} catch (error) {};
				return spawnedProcess;
			};
		};
	};
};

/////////////////////////////////////////////////////////////////////////////////////////////
