'use strict';

// Pending: (package.json, line 15)

/////////////////////////////////  main.js  ///////////////////////////////////////
//                                                                               //
// WIP: Try to run "Non-Tor Browser" (nav buttons and flash) ALSO in main window //
//                                                                               //
///////////////////////////////////////////////////////////////////////////////////

// loads Zeronet default homepage
var HelloZeronet = 'http://localhost:43210/';

///////////////////// Electron ///////////////////
const electron = require('electron');

const { app, crashReporter, dialog, globalShortcut, ipcMain, protocol, remote,
   BrowserWindow, Menu, MenuItem, Tray } = require('electron');

const devtools = require('electron-devtools-installer');

// const ip = require("ip");

// Constants
const fs           = require('fs');
const os           = require('os');
const url          = require('url');
const path         = require('path');
const winston      = require('winston');
const dir          = require('node-dir');
const session      = require('electron').session;
const EventEmitter = require('events').EventEmitter;

// Global app
let window = {}
window._   = require('underscore');

/*
global.__app = {
	basePath: __dirname,
	dataPath: path.join(electron.app.getPath('userData')),
	logPath:  path.join(electron.app.getPath('userData'), 'logs'),
	logger: null
};

// Create log path
if (!fs.existsSync(global.__app.logPath)) {
	fs.mkdirSync(global.__app.logPath);
}

// Create logger
global.__app.logger = new (winston.Logger)({
	transports: [
		new (winston.transports.Console)({ level: 'silly' }),
		new (winston.transports.File)({
			filename: path.join(global.__app.logPath, 'app.log'),
			level: 'info'
		})
	]
});
*/

// Dependencies
var _exist       = require("is-there");
var program      = require('commander');
var monogamous   = require('monogamous');
var configstore  = require('configstore');
var spawn        = require('electron-spawn');

// Processes
const spawnChild   = require('child_process').spawn;
const ChildProcess = require('child_process');

// Utils
const appLogger    = require('./hub/logger');
const Store        = require('./hub/store');

// Icons
var appIcons       = require('./gfx/icons');

// Package info
var pkgInfo        = require('./package.json');

// User browser history
const Datastore    = require('nedb');
var userDP         = app.getPath('userData');
var historyPath    = userDP + '/userdata/history.json';
var extensionsPath = userDP.replace(/\\/g, '/') + '/userdata/extensions';
var userdataPath   = userDP + '/userdata';
var configPath     = userDP + '/personal.config';
var logPath        = userDP + '/verbose.log';
var basePath       = __dirname;

// const globalShortcuts = new Shortcuts();
// const MainProcess     = new MainProcessController();
// MainProcess.start();

// const windowManager = require(basePath + "/js/WindowManager");
// const IPCMain       = require(basePath + "/js/IPCMain");

// Persistant Storage
var PersistentStorage = {};

PersistentStorage.getItem = function(key, callback) {
	// TODO: add check for valid file name format

	var fileToRead = userdataPath + key + ".json";

	// check if JSON file exists
	fs.exists(fileToRead, function(exists) {
		// if file with given key name exists, read file
		if (exists === true) {
			fs.readFile(userdataPath + key + ".json", function(err, data) {
				if (err) callback(err, null);

				try {
					// parse string to JSON object
					data = JSON.parse(data);

					callback(null, data);
				} catch (e) {
					callback({"message": "Invalid data format"}, null);
				}
			});
		} else {
			callback({"message": "File doesn't exist"}, null);
		}
	});
};

PersistentStorage.setItem = function(key, value) {
	// TODO: add check for valid file name format

	var _this = this;
	var fileToWrite = userdataPath + key + ".json";

	if (typeof value === "object" && !Array.isArray(value)) {
		if (_this.isCyclic(value)) {
			throw "Object to store cannot be cyclic";
		}

		// if safe to stringify, go ahead and stringify data
		value = JSON.stringify(value);

		// Save to file
		fs.writeFile(fileToWrite, value, function(err) {
		});
	} else {
		throw "Value must be of an object type";
	}
};

// Check if object is cyclic. If so TypeError will be thrown while stringify-ing the object we're trying to save into JSON

// References
// http://stackoverflow.com/questions/14962018/detecting-and-fixing-circular-references-in-javascript
// http://blog.vjeux.com/2011/javascript/cyclic-object-detection.html

PersistentStorage.isCyclic = function(obj) {
	var seenObjects = [];

	function detect (obj) {
		if (obj && typeof obj === 'object') {
			if (seenObjects.indexOf(obj) !== -1) {
				return true;
			}
			seenObjects.push(obj);
			for (var key in obj) {
				if (obj.hasOwnProperty(key) && detect(obj[key])) {
					console.log(obj, 'cycle at ' + key);
					return true;
				}
			}
		}
		return false;
	}

	return detect(obj);
};
// End Persistent Storage

// Load Navigation History
const navigationHistoryDb = new Datastore({ 
	filename: path.join(userdataPath, 'navigation-history.db'), 
	autoload: true 
});
const autoCompleteDb = new Datastore({ 
	filename: path.join(userdataPath, 'auto-complete-entries.db'), 
	autoload: true 
}); 

// NavigationHistory
var NavigationHistory = {};

NavigationHistory.addNavigationHistory = function(navigationInfo, callback) {
	// add navigation history timestamp
	navigationInfo.date = new Date();

	let completeCount = 0; 
	let jobCount = 2; 

	navigationHistoryDb.insert(navigationInfo, function(err, newDoc) {
		if (err) {
			callback(err);
		} else {
			completeCount++; 
			if (completeCount >= jobCount) {
				callback(); 
			}
		}
	});

	autoCompleteDb.update({
		url: navigationInfo.url
	}, 
	{
		$inc: { visitCount: 1 }, 
		$set: {
			date: navigationInfo.date, 
			title: navigationInfo.title
		}
	}, 
	{
		upsert: true
	}, 
	function(err, numAffected, affectedDocuments, upsert) {
		if (err) {
			callback(err); 
		} else {
			completeCount++; 
			if (completeCount >= jobCount) {
				callback(); 
			}
		}
	}); 
};

// Clears history: @param callback function to be called when all documents are removed (function(err, numRemoved))
NavigationHistory.clearNavigationHistory = function(callback) {
	navigationHistoryDb.remove({}, callback);
};

NavigationHistory.getAutoCompleteList = function(searchTerm, callback) {
	// Escape RegEx characters inside search term
	searchTerm = searchTerm.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
	var searchRegEx = new RegExp(searchTerm);

	// Find a matching domain
	autoCompleteDb.find({
		url: searchRegEx
	})
		.limit(10)
		.sort({ 
			visitCount: -1, 
			date: -1
		})
		.exec(function(err, autoCompleteEntries) {
			callback(autoCompleteEntries);
		});
};
// End NavigationHistory

// Shortcuts
function Shortcuts() {
	// constructor(windowManager) {
	//	this.windowManager = windowManager;
	// }
	let _this = this;
	var shortcutCommands = [
		{
			accelerator: "CommandOrControl+n",
			action: function() {
				_this.windowManager.openNewWindow();
			}
		},
		{
			accelerator: "F11",
			action: function() {
				console.log("F11");
			}
		},
		{
			accelerator: "F12",
			action: function() {
				console.log("opening devtools");
			}
		}
	];
	for (var i = 0; i < shortcutCommands.length; i++) {
		globalShortcut.register(shortcutCommands[i].accelerator, shortcutCommands[i].action);
	}
}


// MainProcessController
// var MainProcessController = function() {
// 	var _this = this;
//	var ipcHandler;
//	var mainProcessEventEmitter;
	
	// var init = function() {
		// attempt to enable Pepper Flash Player plugin
		// attachEventHandlers();
	// };
	
	/*
	var attachEventHandlers = function() {
		app.on("window-all-closed", function() {
			console.log("window-all-closed, quitting");
			if (process.platform != "darwin") {
				console.log("quitting app");
				app.quit();
			}
		});
		app.on("ready", function() {
			session.defaultSession.on("will-download", handleWillDownload);
			// check if .data directory exists
			fs.exists(userdataPath, function(exists) {
				if (exists === false) {
					// create directory if .data directory doesn't exist
					// TODO: check directory create permissions on Linux
					fs.mkdir(userdataPath, function(err) {
						if (err) {
							// TODO: show error messagebox and quit app
							dialog.showMessageBox({
								type: "info",
								buttons: ["ok"],
								title: userdataPath,
								message: JSON.stringify(err),
								detail: JSON.stringify(err)
							});
							app.quit();
						} else {
							startBrowser();
						}
					});
				} else {
					startBrowser();
				}
			});
		});
	};
	*/

// enablePepperFlashPlayer();

// Pepper Flash Player (64bit-Win7+Mac)
function enablePepperFlashPlayer() {
		var flashPath = null;

		// specify flash path based on OS
		if(process.platform  == 'win32'){
			flashPath = path.join(basePath, 'bin', 'pepflashplayer64_25_0_0_127.dll');
		} else if (process.platform == 'darwin') {
			// Mac OS
			flashPath = path.join(basePath, 'bin', 'PepperFlashPlayer.plugin');
		}

		// in case flashPath is set
		if (flashPath) {
			app.commandLine.appendSwitch('ppapi-flash-path', flashPath);
			app.commandLine.appendSwitch('ppapi-flash-version', '25.0.0.127');
		}
}

// startBrowser();

// start browser
/*
function startBrowser() {
		// create a shared EventEmitter for windowManager to communicate with ipcHandler
		EventEmitter = new EventEmitter();
		ipcHandler   = new IPCMain(_this);

		var shortcutHandler = new Shortcuts(windowManager);

		// register all global shortcuts
		shortcutHandler.registerAll();

		windowManager.openNewWindow();
	};
*/

function handleWillDownload(event, item, webContents) {
		item.on("done", function(e, state) {
			if (state === "completed") {
				var itemInfoObj = {
					type: "file-download",
					fileSize: item.getTotalBytes(),
					fileURL: item.getURL(),
					fileName: item.getFilename(),
					fileMimeType: item.getMimeType()
				};
			}
		});
	};
	
	/*
	_this.start = function() {
		init();
	};

	_this.getMainProcessEventEmitter = function() {
		return mainProcessEventEmitter;
	};

	_this.getWindowManager = function() {
		return windowManager;
	};
	*/
	
// }

// module.exports = MainProcessController;
// End MainProcessController

// Save windowbounds
const store = new Store({
  // We'll call our data file 'user-preferences'
  configName: 'user-preferences',
  defaults: {
    // default window size
    windowBounds: { width: 800, height: 600 }
  }
});

// Define config constructor
function Config(cliOverrides, cliInfo) {
  
  // Create config
  this.config = new configstore(pkgInfo.name, {  } );
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

Config.prototype = {
  getAll: function () {
    return  window._.defaults({}, this.cliOverrides, this.config.all);
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
  .version(pkgInfo.version)
  .option('-S, --skip-taskbar', 'Skip showing the application in the taskbar')
  .option('--minimize-to-tray', 'Hide window to tray instead of minimizing')
  .option('--hide-via-tray',    'Hide window to tray instead of minimizing (only for tray icon)')
  .option('--allow-multiple-instances', 'Allow multiple instances of `Fuzium` to run')
  .option('--verbose', 'Display verbose log output in stdout')
  .allowUnknownOption(); // Allow unknown Chromium flags

// Specify keys that can be used by config if CLI isn't provided
var cliConfigKeys = ['skip-taskbar', 'minimize-to-tray', 'hide-via-tray', 'allow-multiple-instances'];
var cliInfo =  window._.object(cliConfigKeys.map(function generateCliInfo (key) {
  return [key,  window._.findWhere(program.options, {long: '--' + key})];
}));

// Generate a logger
var logger = appLogger({ verbose: program.verbose + '' }); // adding a '' activates debug logging.
logger.info('\n\n Writing all logs to "%s"', logPath);

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
var cliConfig =  window._.object(program._cliConfigKeys.map(function getCliValue (dashCaseKey) {
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
		
		let { width, height } = store.get('windowBounds');
		windowInfo.width  = width;
		windowInfo.height = height;
		
		// const state = store.getState();
		// localStorage.myAppState = JSON.stringify(state);
		
		enablePepperFlashPlayer();
		
		startApp();
	}

});

app.on('resize', () => {
	// saveWindowBounds();
	
	// testing..
	let { width, height } = func.browserWindow.getBounds();
	store.set('windowBounds', { width, height });
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
		  'Fuzium: ' + pkgInfo.version,
		  '<br/>',
		  'Zeronet: 0.5.3',
		  '<br/>',
		  'Electron version: ' + process.versions.electron,
		  '<br/>',
		  'Node.js version: ' + process.versions.node,
		  '<br/>',
		  'Pepper Flash Player version: 25.0.0.127',
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
	  width:  540,
	  height: 360,
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
	var configPage = __dirname + '/hub/config.htm';
	configWindow.loadURL(configPage);
	logger.debug('Show config; ' + configPage);
  },
  
  // New window
  openSubWindow: function () {
  	var subWindow = new BrowserWindow({
	  title: 'Fuzium',
	  width:  1000,
	  height: 800,
	  autoHideMenuBar: true,
	  titleBarStyle: 'hidden-inset',
	  icon: appIcons['info-32']
	});
	var subWindowPage = __dirname + '/hub/browser.htm';
	subWindow.loadURL(subWindowPage);
	logger.debug('New Window; ' + subWindowPage);
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

// Create paths if none exist
checkPaths();

function checkPaths() {
    // Check if directory called userdata exists
    if (!_exist(userdataPath)) {
        fs.mkdir(userdataPath);
    }
    // Check if directory called extensions exists
    if (!_exist(extensionsPath)) {
        fs.mkdir(extensionsPath);
    }
    // Check if file called history.json exists
    if (!_exist(historyPath)) {
        fs.writeFile(historyPath, '{"history":[]}');
    }
}

// Assign tray click behavior
func.onTrayClick = (config.get('hide-via-tray') || config.get('minimize-to-tray')) ?
  func.toggleVisibility : func.toggleMinimize;

func.onRaise = (config.get('hide-via-tray') || config.get('minimize-to-tray')) ?
  func.showInvisibleWindow : func.showMinimizedWindow;

// Shorten tooltips
function truncateStr(str, len) {
  // If the string is over the length then truncate it
  // (go 1 under length so there's room for ellipses)
  if (str.length > len) {
	return str.slice(0, len - 2) + '…';
  }
  return str;
}

// If we are only allowing single instances
var booter;

if (!config.get('allow-multiple-instances')) {
  
  // Start up/connect to a monogamous server (detects other instances)
  booter = monogamous({sock: pkgInfo.name});
  
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
	  //transparent:   true,
	  autoHideMenuBar: false,
	  titleBarStyle: 'hidden-inset',
	  width:  windowInfo.width  || 1000,
	  height: windowInfo.height || 900,
	  x: windowInfo.x || null,
	  y: windowInfo.y || null,
	  icon: appIcons['icon-32'],
	  preload: __dirname + '/hub/browser.js',
	  title: 'Fuzium'
	};
	
	// Define main browser window
	func.browserWindow = new BrowserWindow(windowOpts);
	
	// Todo: Set window resizable and focus
	// func.browserWindow.setResizable(true);
	// func.browserWindow.focus();
	// func.browserWindow.loadURL('https://google.com');
	
	// Logger info
	logger.info('\n\n App is ready:', {
	  version: pkgInfo.version,
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
	func.browserWindow.on('move',  window._.debounce(function handleWindowMove () {
	  // logger.debug('Browser window moved, saving window info in config.');
	  saveWindowInfo();
	}, 250));

	// Save the window size after resizing
	func.browserWindow.on('resize',  window._.debounce(function handleWindowResize () {
	  // logger.debug('Browser window resized, saving window info in config.');
	  saveWindowInfo();
	}, 250));

	// When window is closed, clean up the reference to window
	func.browserWindow.on('closed', function handleWindowClose () {
	  logger.debug('Fuzium shutting down.');
	  func.browserWindow = null;
	  if (fuzium) { fuzium.kill('SIGINT'); }
	});

  	// Set download folder 
	func.browserWindow.webContents.session.on('will-download', (event, item, webContents) => {
	  // Set the save path, so electron doesn't prompt a save dialog
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
	var menuTemplate = require('./json/menus/' + process.platform + '.json');
	bindMenuItems(menuTemplate.menu);
	Menu.setApplicationMenu(Menu.buildFromTemplate(menuTemplate.menu));
	
	// Assign tray click behavior
	func.onTrayClick = (config.get('hide-via-tray') || config.get('minimize-to-tray')) ?
		func.toggleVisibility : func.toggleMinimize;
	
	func.onRaise = (config.get('hide-via-tray') || config.get('minimize-to-tray')) ?
		func.showInvisibleWindow : func.showMinimizedWindow;
	
	// Tray icon menu
	var trayMenu = new Menu();
	
	trayMenu.append(new MenuItem({
		label: 'Show/hide',
		click: func.onTrayClick
	}));
	
	trayMenu.append(new MenuItem({
		type: 'separator'
	}));
	
	trayMenu.append(new MenuItem({
		label: 'Restart',
		click: function() { ipcRenderer.send('restart', 'true' ); console.log('restarting..'); }
	}));
	
	trayMenu.append(new MenuItem({
		label: 'Quit',
		click: func.quitApplication
	}));
	
	// App tray icon
	var appIcon = new Tray( appIcons['icon-32'] );
	appIcon.setContextMenu(trayMenu);
	appIcon.setToolTip('Fuzium');
	
	// Tray clicked; toggle visibility
	appIcon.on('clicked', func.onTrayClick);

	// State change; update tooltip
	ipcMain.on('change:state', function handlestateChange(evt, stateInfo) {
	  func.logger.debug('Updating tray tooltip', {
	    stateInfo: stateInfo
	  });
	  
	  // Max length of 127 chars on Windows
	  var infoStr = [
	    truncateStr('Zeronet :', 9),
	    truncateStr('Electron:', 9)
	  ].join('\n');
	  appIcon.setToolTip(infoStr);
	});
	
	// Config change; update icon
	ipcMain.on('change:config', function handlePlaybackChange(evt, configState) {
	  func.logger.debug('Updating tray icon; Config -', {
	    configState: configState
	  });
	  // var icon = appIcons['updated-icon-32'];
	  // appIcon.setImage(icon);
	});
	
	// Timing bootup.
	// Getting Electron's and Zeronet's timing right will depend on each device.
	// Of course Electron should be ready first while Zeronet is booting.
	// Timing is improving as more things get added anyway.
	
	if (func.browserWindow) {
		// Hopefully Zeronet is ready to go after a few seconds.
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
		// var devOnly  = spawnChild(path.resolve(__dirname + '/bin/zeronet.exe'), ['--open_browser', '']);
		// ..or..
		// var forApp   = path.resolve(path.dirname(process.execPath), '..', __dirname + '/bin/zeronet.exe');
		// var packaged = spawnChild(forApp, { detached: false } ); // { stdio: 'inherit' }
		
		// (note: our "fuzium.kill" process needs fixing now there's an installer)
		var fuzium = startZeronet();
		// console.log('\n fuzium = ' + fuzium + '\n');
		
		// Spawn Zeronet as child of Electron
		function startZeronet() {
			
			// process.env.PATH
			
			var detatch = true;
			
			// Check args (dev or release)
			if (process.argv.length === 1) {
				var ZeronetApp = app.getAppPath() + '\\bin\\zeronet.exe';
				
				// With installer we seem to lose our console even if it's detatched
				// (and Zeronet now fails to start...)
				// return spawn(ZeronetApp, { detached: true } ); // ['--open_browser', '']);
				
				var electron = ChildProcess.spawn(ZeronetApp, ['--open_browser', ''], ['--homepage', '1LANDERvVWbShpNWpsrbBvfqSK1PabXtwv'] );
				electron.stderr.on('data', function (data) {
					console.error(data.toString())
				});
				electron.stdout.on('data', function (data) {
					console.log(data.toString())
				});
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
			var appNet      = path.resolve(path.join(__dirname, '/bin/zeronet.exe') );
			console.log('appNet = ' + appNet);
			
			// Spawn Zeronet
			return spawnChild( appNet, ['--open_browser', ''], ['--homepage', '1LANDERvVWbShpNWpsrbBvfqSK1PabXtwv'] ); // { detached: false }
			// return   spawn( appNet, { detached: true }, ['--open_browser', ''] ); // { detached: false }
			
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

// Bind menus
function bindMenuItems(menuItems) {
  menuItems.forEach(function bindMenuItemFn (menuItem) {
	// If there is a role, continue
	if (menuItem.role !== undefined) {
	  return;
	}
	// If there is a separator, continue
	if (menuItem.type === 'separator') {
	  return;
	}
	// If there is a submenu, recurse it
	if (menuItem.submenu) {
	  bindMenuItems(menuItem.submenu);
	  return;
	}
	
	// else find the function for command
	var cmd = menuItem.command;
	if (cmd === 'application:about') {
	  menuItem.click = func.openAboutWindow;
	} else if (cmd === 'application:show-settings') {
	  menuItem.click = func.openConfigWindow;
	} else if (cmd === 'application:new-window') {
	  menuItem.click = func.openSubWindow;
	} else if (cmd === 'application:quit') {
	  menuItem.click = func.quitApplication;
	} else if (cmd === 'window:reload') {
	  menuItem.click = func.reloadWindow;
	} else if (cmd === 'window:toggle-dev-tools') {
	  menuItem.click = func.toggleDevTools;
	} else if (cmd === 'window:toggle-full-screen') {
	  menuItem.click = func.toggleFullScreen;
	} else {
	  throw new Error('Could not find function for menu command "' + cmd + '" ' +
	    'under label "' + menuItem.label + '"');
	}
  });
};

/////////////////////////////////////////////////////////////////////////////////////////////

