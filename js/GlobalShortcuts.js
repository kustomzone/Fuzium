'use strict';

const electron = require('electron');
const globalShortcut = electron.globalShortcut;

class GlobalShortcuts {
	constructor(windowManager) {
		this.windowManager = windowManager;
	}

	registerAll() {
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
	};
}

module.exports = GlobalShortcuts;