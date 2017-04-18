'use strict';

const electron = require('electron');
const BrowserWindow = electron.BrowserWindow;
const PersistentStorage = require(__app.basePath + "/js/PersistentStorage");
var logger = global.__app.logger;
var windowManager = {};
var windowList = {};
var createdWindowCount = 0;

// TODO: navigate to specified url
windowManager.openNewWindow = function(url) {
	var _this = this;

	// get last browser size
	PersistentStorage.getItem("browserWindowSize", function(err, browserSize) {
		if (err) {
			browserSize = {
				width: 1000,
				height: 800
			};
			logger.debug('Could not get browserWindowSize from PersistentStorage');
			logger.debug(browserSize);
		} else {
			logger.debug('Got browserWindowSize from PersistentStorage');
			logger.debug(browserSize);
		}

		// create the browser window
		var newWindow = new BrowserWindow({
			width: browserSize.width,
			height: browserSize.height,
			frame: true
		});
		newWindow.initialURL = url;

		// load the HTML file for browser window
		newWindow.loadURL("file://" + __app.basePath + "/html/browser-window.html");

		// Open the DevTools (debugging)
		// newWindow.webContents.openDevTools();
		windowList[newWindow.id] = newWindow;
		_this.attachEventHandlers(newWindow);

		// increase window count
		createdWindowCount++;
	});
};

windowManager.attachEventHandlers = function(browserWindow) {
	var _this = this;
	var windowId = browserWindow.id;

	// save browser window's width/height when user closes it
	browserWindow.on('close', function() {
		var size = browserWindow.getSize();
		var sizeObject = {
			"width": size[0],
			"height": size[1]
		};
		// save to persistent storage
		PersistentStorage.setItem("browserWindowSize", sizeObject);
	});

	// remove the window from windowList and remove reference so that GC can clear it from memory
	browserWindow.on('closed', function() {
		if (windowList.hasOwnProperty(windowId)) {
			console.log("deleting window " + windowId);
			delete windowList[windowId];
			browserWindow = null;
		}
	});
};

module.exports = windowManager;