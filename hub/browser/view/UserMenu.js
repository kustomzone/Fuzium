'use strict';

/**
 * User menu and related controls
 *
 * @param hackBrowserWindow
 * @constructor
 */
function UserMenu(hackBrowserWindow) {
	const electron = require('electron'); 
	const remote = electron.remote; 
	const Menu = remote.Menu;
	const logger = remote.getGlobal('__app').logger; 

	let menuTemplate; 

	// An estimate of the user menu's width
	// Since there is no way to programmatically get the width 
	// of user menu, the fixed value here is used to open the 
	// logger
	const menuWidth = 221; 

	var _this = this;

	/* ====================================
	 private member variables
	 ====================================== */
	var userMenuBtnEl;

	/* ====================================
	 private methods
	 ====================================== */
	var init = function() {
		userMenuBtnEl = document.getElementById('button-menu'); 

		menuTemplate = [
			{
				label: "New tab",
				accelerator: "Ctrl+T",
				enabled: true, 
				click: function(item, focusedWindow) {
					logger.debug('New Tab'); 
				}
			},
			{
				label: "New window",
				accelerator: "Ctrl+N",
				enabled: true,
				click: function(item, focusedWindow) {
					logger.debug('New window'); 
					// hackBrowserWindow.goForward();
				}
			},
			{
				type: "separator"
			},
			{
				label: "Print",
				accelerator: "CmdOrCtrl+P",
				click: function(item, focusedWindow) {
					hackBrowserWindow.getActiveTabView().getWebViewEl().print();
				}
			}
		]; 

		attachEventListeners(); 
	};

	var attachEventListeners = function() {
		userMenuBtnEl.addEventListener('click', handleMenuBtnClick, false); 
	};

	var handleMenuBtnClick = function(e) { 
		e.preventDefault(); 

		showUserMenu(); 
	};

	var calculateOpenPosition = function() {
		// Calculate open position
		let browserWindowContentBounds = electron.remote.getCurrentWindow().getContentBounds();
		let windowXPos = browserWindowContentBounds.x;
		let windowWidth = browserWindowContentBounds.width;

		return {
			x: windowWidth - menuWidth, 
			y: 60
		}
	}; 

	/**
	 * Build and show user menu
	 */
	var buildUserMenu = function() {
		var userMenu = Menu.buildFromTemplate(menuTemplate); 

		return userMenu; 
	};

	var showUserMenu = function() {
		let userMenu = buildUserMenu(); 
		let openPosition = calculateOpenPosition(); 

		userMenu.popup(remote.getCurrentWindow(), { 
			x: openPosition.x, 
			y: openPosition.y, 
			async: true 
		});
	};


	/* ====================================
	 public methods
	 ====================================== */

	/**
	 * Open user menu
	 */
	_this.open = function() {
		showUserMenu(); 
	};

	init();
}