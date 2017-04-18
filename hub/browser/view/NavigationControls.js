'use strict';

/**
 * NavigationControls module includes handling for back button, forward button,
 * reload button, address bar, and menu button
 *
 * @param hackBrowserWindow
 * @constructor
 */
function NavigationControls(hackBrowserWindow) {
	var _this = this;

	/* ====================================
	 private member variables
	 ====================================== */
	var backBtnEl;
	var forwardBtnEl;
	var reloadBtnEl;
	var stopLoadingBtnEl;
	var menuBtnEl;

	var disabledClass = "disabled";


	/* ====================================
	 private methods
	 ====================================== */
	var init = function() {
		backBtnEl = document.getElementById("button-back");
		forwardBtnEl = document.getElementById("button-forward");
		reloadBtnEl = document.getElementById("button-reload");
		stopLoadingBtnEl = document.getElementById("button-stop-loading");
		menuBtnEl = document.getElementById("button-menu");

		attachEventHandlers();
	};

	/**
	 * attach event handlers for navigation controls
	 */
	var attachEventHandlers = function() {
		backBtnEl.addEventListener("click", onBackBtnClick); 				// "Back" button
		forwardBtnEl.addEventListener("click", onForwardBtnClick);	 		// "Forward" button
		reloadBtnEl.addEventListener("click", onReloadBtnClick); 			// "Refresh" button
		stopLoadingBtnEl.addEventListener("click", onStopLoadingBtnClick);	// "Stop Loading" button
		menuBtnEl.addEventListener("click", onMenuBtnClick);				// "Menu" button
	};

	/**
	 * event handler for 'back' button
	 *
	 * @param e {Event} click event
	 */
	var onBackBtnClick = function(e) {
		hackBrowserWindow.goBack();
		hackBrowserWindow.updateWindowControls();

		e.preventDefault();
	};

	/**
	 * event handler for 'forward' button
	 *
	 * @param e {Event} click event
	 */
	var onForwardBtnClick = function(e) {
		hackBrowserWindow.goForward();
		hackBrowserWindow.updateWindowControls();

		e.preventDefault();
	};

	/**
	 * event handler for 'reload' button
	 *
	 * @param e {Event} click event
	 */
	var onReloadBtnClick = function(e) {
		hackBrowserWindow.reload();

		e.preventDefault();
	};

	/**
	 * event handler for 'stop-load' button
	 *
	 * @param e {Event} click event
	 */
	var onStopLoadingBtnClick = function(e) {
		hackBrowserWindow.stopLoading();

		e.preventDefault();
	};

	/**
	 * event handler for 'menu' button
	 *
	 * @param e {Event} click event
	 */
	var onMenuBtnClick = function(e) {
		e.preventDefault();
	};


	/* ====================================
	 public methods
	 ====================================== */
	/**
	 * enable 'back' button
	 */
	_this.enableBackBtn = function() {
		backBtnEl.classList.remove(disabledClass);
	};

	/**
	 * disable 'back' button
	 */
	_this.disableBackBtn = function() {
		backBtnEl.classList.add(disabledClass);
	};

	/**
	 * enable 'forward' button
	 */
	_this.enableForwardBtn = function() {
		forwardBtnEl.classList.remove(disabledClass);
	};

	/**
	 * disable 'forward' button
	 */
	_this.disableForwardBtn = function() {
		forwardBtnEl.classList.add(disabledClass);
	};

	/**
	 * show 'load-stop' button
	 *
	 * The 'load-stop' button should be shown while loading
	 */
	_this.showLoadStopBtn = function() {
		reloadBtnEl.style.display = "none";
		stopLoadingBtnEl.style.display = "block";
	};

	/**
	 * show 'reload' button
	 *
	 * The 'reload' button should be shown when loading is complete
	 */
	_this.showReloadBtn = function() {
		reloadBtnEl.style.display = "block";
		stopLoadingBtnEl.style.display = "none";
	};

	/**
	 * refresh navgation control buttons' state
	 *
	 * @param webViewEl {DOMElement} <WebView> element to reflect the status
	 */
	_this.updateBtnStatus = function(webViewEl) {
		if (webViewEl.canGoBack() === true) {
			_this.enableBackBtn();
		} else {
			_this.disableBackBtn();
		}

		if (webViewEl.canGoForward() === true) {
			_this.enableForwardBtn();
		} else {
			_this.disableForwardBtn();
		}
	};

	init();
}