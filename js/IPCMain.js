'use strict';

const navigationHistoryHandler = require(global.__app.basePath + "/js/NavigationHistory");

/**
 * handles all IPC communication with the renderer processes (browser windows)
 *
 * @param mainProcessController
 * @constructor
 */
function IPCMainProcessHandler(mainProcessController) {
	const ipcMain = require('electron').ipcMain;

	var _this = this;
	var windowManager;

	/* ====================================
	 private methods
	 ===================================== */
	var init = function() {
		windowManager = mainProcessController.getWindowManager();

		attachEventHandlers();
	};

	var attachEventHandlers = function() {
		ipcMain.on("newWindowOpenRequest", handleNewWindowOpenRequest); 
		ipcMain.on("addNavigationHistoryRequest", handleAddNavigationHistoryRequest);
		ipcMain.on("autoCompleteEntriesRequest", handleAutoCompleteEntriesRequest);
	};

	var handleNewWindowOpenRequest = function(event, url) {
		windowManager.openNewWindow(url);

		event.sender.send("newWindowOpenResponse", true);
	};
	
	var handleAddNavigationHistoryRequest = function(event, navigationInfo) {
		navigationInfo = JSON.parse(navigationInfo);

		navigationHistoryHandler.addNavigationHistory(navigationInfo, function(err) {
			if (err) {
				event.sender.send("newNavigationHistoryResponse", false);
			} else {
				event.sender.send("newNavigationHistoryResponse", true);
			}
		});
	};

	var handleAutoCompleteEntriesRequest = function(event, searchTerm) {
		navigationHistoryHandler.getAutoCompleteList(searchTerm, function(autoCompleteEntries) {
			event.sender.send("autoCompleteEntriesResponse", JSON.stringify(autoCompleteEntries));
		});
	};

	init();
}

module.exports = IPCMainProcessHandler;