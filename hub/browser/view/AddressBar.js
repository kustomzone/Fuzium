'use strict';

/**
 * Address bar and related controls
 *
 * @param hackBrowserWindow
 * @constructor
 */
function AddressBar(hackBrowserWindow) {
	var _this = this;

	const logger = require('electron').remote.getGlobal('__app').logger; 

	/* ====================================
	 private member variables
	 ====================================== */
	var addressBarEl;
	var hasFocus;
	var currentURL; 		// Used to restore the current URL in case user types some value to the address bar but doesn't navigate


	/* ====================================
	 private methods
	 ====================================== */
	var init = function () {
		addressBarEl = document.getElementById("address-bar");
		hasFocus = false;

		attachEventHandlers();
	};

	/**
	 * attach event handlers for menu bar buttons
	 */
	var attachEventHandlers = function () {
		addressBarEl.addEventListener("click", handleAddressBarClick);
		addressBarEl.addEventListener("keyup", handleAddressBarKeyUp);
		addressBarEl.addEventListener("focus", handleAddressBarFocus);
		addressBarEl.addEventListener("focusout", handleAddressBarFocusOut);
	};

	/**
	 * handle address bar click event
	 *
	 * @param e
	 */
	var handleAddressBarClick = function (e) {
		e.preventDefault();
	};

	/**
	 * handle address bar keypress event
	 *
	 * @param e
	 */
	var handleAddressBarKeyUp = function (e) {
		// update url value
		var urlValue = addressBarEl.value;

		// "enter" key
		if (e.keyCode === KeyCode.ENTER) {
			e.preventDefault();

			if (urlValue.trim() === "") {
				// do nothing
				return;
			}

			// focus out of current input element
			document.activeElement.blur();

			hackBrowserWindow.navigateTo(urlValue);
		}

		// "up" key
		else if (e.keyCode === KeyCode.UP) {
			hackBrowserWindow.getAutoCompleteBox().navigateUp();
		}

		// "down" key
		else if (e.keyCode === KeyCode.DOWN) {
			hackBrowserWindow.getAutoCompleteBox().navigateDown();
		}

		// "esc" key
		else if (e.keyCode === KeyCode.ESC) {
			hackBrowserWindow.getAutoCompleteBox().close();

			// Restore URL
			_this.restoreURL(); 
		}

		else {
			if (urlValue.trim() !== "") {
				hackBrowserWindow.getAutoCompleteBox().update(urlValue);
			}

			else {
				// Close auto complete box if address bar is empty
				hackBrowserWindow.getAutoCompleteBox().close(); 
			}
		}
	};

	/**
	 * handler to execute when address bar obtains focus
	 */
	var handleAddressBarFocus = function () {
		// select text in input box
		if (hasFocus === false) {
			this.select();
		}

		hasFocus = true;
	};

	/**
	 * handler to execute when address bar input loses focus
	 */
	var handleAddressBarFocusOut = function () {
		hasFocus = false;

		hackBrowserWindow.getAutoCompleteBox().close();
	};


	/* ====================================
	 public methods
	 ====================================== */
	/**
	 * focus on address bar
	 */
	_this.focusOnAddressBar = function () {
		addressBarEl.focus();
	};

	/**
	 * check whether address bar input element has focus
	 *
	 * @returns {boolean} whether address bar is currently focused
	 */
	_this.isAddressBarFocused = function () {
		return (addressBarEl === document.activeElement);
	};

	/**
	 * updates URL string in address bar input element
	 *
	 * @param url {string} new url
	 */
	_this.updateURL = function (url) {
		console.log("AddressBar.updateURL(" + url + ")");

		if (url && url.startsWith("file://")) {
			url = "";
		}

		addressBarEl.value = url;

		// Save the new URL to currentURL
		// This value is used to restore the currentURL value 
		// in case user types in some value to the address bar, 
		// or if address bar's value is changed with an autocomplete suggestion, 
		// but the user cancels the navigation by pressing ESC 
		// -
		// Losing focus on address bar will also restore currentURL
		currentURL = url; 

		// TODO: Why is hasFocus needed? 
		/*
		if (hasFocus === false) {
			addressBarEl.value = url;
		}
		*/
	};

	/**
	 * Restores URL value
	 */
	_this.restoreURL = function() {
		addressBarEl.value = currentURL; 
	}; 

	init();
}