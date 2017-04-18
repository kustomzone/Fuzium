'use strict';

/**
 * Address bar and related controls
 *
 * @param hackBrowserWindow
 * @constructor
 */
function AutoCompleteBox(hackBrowserWindow) {
	var _this = this;

	const logger = require('electron').remote.getGlobal('__app').logger; 

	/* ====================================
	 private member variables
	 ====================================== */
	var autoCompleteBoxEl;
	var autoCompleteEntries;
	var currentIndex;			// index used for autocomplete entries


	/* ====================================
	 private methods
	 ====================================== */
	var init = function() {
		autoCompleteBoxEl = document.getElementById("auto-complete-box");
		currentIndex = -1;

		attachEventHandlers();
	};

	/**
	 * attach event handlers for auto complete box
	 */
	var attachEventHandlers = function() {
	};

	/**
	 * add an autocomplete item to autocomplete DOM element
	 *
	 * @param url
	 * @param title
	 * @returns {DOMElement} DOM node of appended item
	 */
	var addItem = function(url, title) {
		var autoCompleteItemInnerHTML = '<span class="url">{{url}}</span> - <span class="title">{{title}}</span>';
		var itemEl;

		autoCompleteItemInnerHTML = autoCompleteItemInnerHTML.replace("{{url}}", url);
		autoCompleteItemInnerHTML = autoCompleteItemInnerHTML.replace("{{title}}", title);

		itemEl = document.createElement("div");
		itemEl.classList.add("item");
		itemEl.innerHTML = autoCompleteItemInnerHTML;
		itemEl.dataset.url = url;
		
		attachEventListenerToItem(itemEl);

		autoCompleteBoxEl.appendChild(itemEl);

		return itemEl;
	};

	var attachEventListenerToItem = function(itemEl) {
		itemEl.addEventListener('mousedown', function(e) {
			// Prevent focusout by preventing mouse click behavior
			e.preventDefault();

			_this.close();

			// Navigate to 
			hackBrowserWindow.getAddressBar().updateURL(itemEl.dataset.url);
			hackBrowserWindow.navigateTo(itemEl.dataset.url);
		});
	};

	/**
	 * Render the list of autocomplete entries
	 */
	var render = function() {
		autoCompleteBoxEl.innerHTML = "";

		// if no autocomplete entry exist, close autocomplete box
		if (autoCompleteEntries.length === 0) {
			_this.close();

			return;
		}

		for (var i = 0, len = autoCompleteEntries.length; i < len; i++) {
			var appendedEl = addItem(autoCompleteEntries[i].url, autoCompleteEntries[i].title);

			autoCompleteEntries[i].el = appendedEl;
		}

		currentIndex = 0;
		autoCompleteEntries[currentIndex].el.classList.add("selected");

		_this.open();
	};

	/**
	 * Focus on a specific entry by index
	 * 
	 * @param {int} newIndex Index to focus on
	 */
	var focusByIndex = function(newIndex) {
		autoCompleteEntries[currentIndex].el.classList.remove("selected");
		autoCompleteEntries[newIndex].el.classList.add("selected");

		hackBrowserWindow.getAddressBar().updateURL(autoCompleteEntries[newIndex].url);

		currentIndex = newIndex;
	};



	/* ====================================
	 public methods
	 ====================================== */
	 /**
	  * Open autocomplete box
	  */
	_this.open = function() {
		autoCompleteBoxEl.style.display = "block";
	};

	/**
	 * Close autocomplete box
	 */
	_this.close = function() {
		autoCompleteBoxEl.style.display = "none";
	};

	/**
	 * Move focus downward
	 */
	_this.navigateDown = function() {
		// if index points to last element in autocomplete entries,
		// do nothing
		if (currentIndex === autoCompleteEntries.length - 1) {
			// do nothing
			return;
		}

		focusByIndex(currentIndex + 1);
	};

	/**
	 * Move focus upward
	 */
	_this.navigateUp = function() {
		// if index points to the first element in autocomplete entries,
		// do nothing
		if (currentIndex === 0) {
			// do nothing
			return;
		}

		focusByIndex(currentIndex - 1);
	};

	/**
	 * Update autocomplete entries with a new search term
	 */
	_this.update = function(searchTerm) {
		hackBrowserWindow.getIPCHandler().requestAutoCompleteEntries(searchTerm, function(newAutoCompleteEntries) {
			autoCompleteEntries = newAutoCompleteEntries;
			render();
		});
	};

	init();
}