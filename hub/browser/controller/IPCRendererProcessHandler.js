'use strict';

/**
 * handles all IPC communication with the main process
 *
 * @param hackBrowserWindow controller
 * @constructor
 */
function IPCRendererProcessHandler(hackBrowserWindow) {
	const ipcRenderer = require("electron").ipcRenderer;

	var _this = this;

	/* ====================================
	 public methods
	 ====================================== */
	/**
	 * send a request to open a new HackBrowser window
	 *
	 * @param url {string} url to open with new window
	 */
	_this.requestNewWindowOpen = function(url) {
		ipcRenderer.send("newWindowOpenRequest", url);
	};


	_this.requestAddNavigationHistory = function(navigationInfo, callback) {
		ipcRenderer.send("addNavigationHistoryRequest", JSON.stringify(navigationInfo));
		ipcRenderer.once("addNavigationHistoryResponse", function(e, result) {
			callback(result);
		});
	};

	_this.requestAutoCompleteEntries = function(keyword, callback) {
		ipcRenderer.send("autoCompleteEntriesRequest", keyword);
		ipcRenderer.once("autoCompleteEntriesResponse", function(e, autoCompleteEntries) {
			autoCompleteEntries = JSON.parse(autoCompleteEntries);
			

			callback(autoCompleteEntries);
		});
	};
}