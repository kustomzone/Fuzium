'use strict';

let windows = []; // global reference

var mainAddr = 'http://127.0.0.1:43110/1HeLLo4uzjaLetFx6NH3PMwFP3qbRbTf3D'; // Zeronet homepage

const { electron, app, crashReporter, globalShortcut, ipcMain, protocol,
   BrowserWindow, Menu, MenuItem, Tray } = require('electron'); // remote

const electronLocalshortcut = require('electron-localshortcut');

// Report crashes
// electron.crashReporter.start()

// Global constants
const fs         = require('fs');
const os         = require('os');
const url        = require('url');
const path       = require('path');
const dir        = require('node-dir');


// Load dependencies
var _            = require('underscore');
var monogamous   = require('monogamous');
var IsThere      = require("is-there");

// Load utils
var appConfig	 = require('./app/js/config');
var appMenu      = require('./app/js/menu');
var appTray      = require('./app/js/tray');
var appLogger    = require('./app/js/logger');
var appIcons     = require('./app/gfx/icons');

// Multiplatform menus
// var menuTemplate = require('./app/menus/' + process.platform + '.json');

// Set history data
var historyPath    = app.getPath('userData') + '/userdata/history.json';
var extensionsPath = app.getPath('userData').replace(/\\/g, '/') + '/userdata/extensions';
var userdataPath   = app.getPath('userData') + '/userdata';
var configPath     = app.getPath("userData") + "/personal.config";

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

// Load app info
var pkg = require('./package.json');

// Load CLI parser
var program	= require('./app/js/cli-parser').parse(process.argv);

// Generate a logger
var logger = appLogger({ verbose: '' + program.verbose }); // adding '' activates CLI logging ...?

// Log CLI arguments
logger.debug('CLI arguments received', { argv: process.argv });

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
var config = new appConfig(cliConfig, program._cliInfo, '\n');
logger.debug('Generated starting config options \n', config.getAll(), '\n');


/////////////////// Zeronet app //////////////////
var spawnChild   = require('child_process').spawn;

/*

const spawnWindow = () => {
	const win = new BrowserWindow({
      width: 800,
      height: 600,
      frame: true // 'title-bar-style': 'hidden'
    });
	
	// win.loadURL('file://' + __dirname + '/index.html');
	
	win.on('closed', function () {
      var index = windows.indexOf(win)
      if (index > -1) {
       windows.splice(index, 1)
      }
    });
	
	win.loadURL('https://github.com');
	win.show();
	
	electronLocalshortcut.register(win, 'Ctrl+A', () => {
	    console.log('You pressed ctrl & A');
	});
	
	electronLocalshortcut.register(win, 'Ctrl+B', () => {
	    console.log('You pressed ctrl & B');
	});
	
	console.log(
	    electronLocalshortcut.isRegistered(win, 'Ctrl+A')
	);
	
	electronLocalshortcut.unregister(win, 'Ctrl+A');
	electronLocalshortcut.unregisterAll(win);
	
	return win;
};

*/

////////////// Window ready ////////////////
app.on('ready', function() {
	
	/*
	windows.push(spawnWindow());
	
	ipcMain.on('quit-application', () => {
		app.quit()
    });
  
    ipcMain.on('new-window', () => windows.push(spawnWindow()))
    process.on('new-window', () => windows.push(spawnWindow()))
	
    ipcMain.on('close-window', () => BrowserWindow.getFocusedWindow().close())
    process.on('close-window', () => BrowserWindow.getFocusedWindow().close())
	
    // Most of these events will simply be listened to by the app store and acted upon.
    // However sometimes there are no state changes, for example with focusing the URL bar.
    // In those cases it's acceptable for the individual components to listen to the events.
	
    const simpleWebContentEvents = [
     ['CmdOrCtrl+L',     'shortcut-focus-url'],
     ['Escape',          'shortcut-stop'],
     ['Ctrl+Tab',        'shortcut-next-tab'],
     ['Ctrl+Shift+Tab',  'shortcut-prev-tab'],
     ['CmdOrCtrl+R',     'shortcut-reload'],
     ['CmdOrCtrl+=',     'shortcut-zoom-in'],
     ['CmdOrCtrl+-',     'shortcut-zoom-out'],
     ['CmdOrCtrl+0',     'shortcut-zoom-reset'],
     ['CmdOrCtrl+Alt+I', 'shortcut-toggle-dev-tools']
    ];
	
    simpleWebContentEvents.forEach((shortcutEventName) =>
      electronLocalshortcut.register(shortcutEventName[0], () => {
        BrowserWindow.getFocusedWindow().webContents.send(shortcutEventName[1])
    }));
	
    electronLocalshortcut.register('CmdOrCtrl+Shift+J', () => {
      BrowserWindow.getFocusedWindow().toggleDevTools()
    });
	
	*/
	
	if (booter) {
		booter.boot();
	} else { // launch app
		startMain();
		// Menu.init();
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
		'<img src="' + logo + '">',
	  '</div>'
	].join('');
	
	var aboutWindow = new BrowserWindow({
	  title: 'About',
	  width:  420,
	  height: 220,
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
	var configPage = __dirname + '/app/js/config.htm';
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

// Create paths if none exist
// checkPaths();

function checkPaths() {
    //check if directory called userdata exists
    if (!IsThere(userdataPath)) {
        fs.mkdir(userdataPath);
    }
    //check if directory called extensions exists
    if (!IsThere(extensionsPath)) {
        fs.mkdir(extensionsPath);
    }
    //check if file called history.json exists
    if (!IsThere(historyPath)) {
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
  booter.on('boot', startMain);

  // Otherwise, focus it
  booter.on('reboot', func.onRaise);

  // If we encounter an error, log it and start anyway
  booter.on('error', function handleError (err) {
	logger.info('Ignoring boot error ' + err + ' while connecting to monogamous server');
	startMain();
  });
}

// Define a truncation utility for tooltip
function truncateStr(str, len) {
  // If the string is over the length, then truncate it
  // DEV: We go 1 under length so we have room for ellipses
  if (str.length > len) {
	return str.slice(0, len - 2) + '…';
  }

  // Otherwise, return the string
  return str;
}

///////////////////////// Create Main Window /////////////////////////
function startMain() {
	
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
	  preload: __dirname + '/app/js/browser.js',
	  title: 'Fuzium'
	};
	
	// Logger info
	logger.info('\n\n App is ready:', {
	  version: pkg.version,
	  platform: process.platform,
	  options: windowOpts,
	  processVersions: process.versions
	});
	
	// Loading Zeronet
	func.browserWindow = new BrowserWindow(windowOpts);
	func.browserWindow.loadURL(mainAddr);
	
	// Set window resizable and focus
	func.browserWindow.setResizable(true); // ?
	// func.browserWindow.focus();
	
	// func.browserWindow.loadURL('https://google.com');

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
	  logger.debug('Fuzium closing down.');
	  func.browserWindow = null;
	  fuzium.kill('SIGINT');
	});

  	// Set download folder 
	func.browserWindow.webContents.session.on('will-download', (event, item, webContents) => {
	  // Set the save path, making Electron not to prompt a save dialog
	  item.setSavePath('download/'+item.getFilename());
	 
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
	
	console.log('\n [ALT]  Show menu');
	console.log('[CTRL-R] Reboot Zeronet (if not showing) \n');
	
	// Spawn Zeronet as child of Electron
	var fuzium = spawnChild('./app/bin/zeronet.exe', ['--open_browser', ''])
	
	// Set up appl menu, tray, and shortcuts
	appMenu.init(func);
	appTray.init(func);
	
	// func.browserWindow.getCurrentWindow().reload()
	// BrowserWindow.getFocusedWindow().reload();
	
};

