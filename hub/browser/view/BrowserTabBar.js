'use strict';

/**
 * Browser tabs and related controls
 * BrowserTabBar contains one or more BrowserTab objects
 *
 * @param hackBrowserWindow
 * @constructor
 */
function BrowserTabBar(hackBrowserWindow) {
	var _this = this;

	const navTabSelector = '.nav-tab'; 

	/* ====================================
	 private member variables
	 ====================================== */
	var browserTabsWrapperEl;
	var addTabBtnEl;
	var numOpenTabs;
	var tabWidth;


	/* ====================================
	 private methods
	 ====================================== */
	var init = function() {
		browserTabsWrapperEl = document.getElementById("navtabs");
		addTabBtnEl = document.getElementById("add-tab");
		numOpenTabs = 0;

		attachEventHandlers();
	};

	/**
	 * attach event handlers for menu bar buttons
	 */
	var attachEventHandlers = function() {
		addTabBtnEl.addEventListener("click", function(e) {
			hackBrowserWindow.addNewTab(null, true);

			e.preventDefault();
		});

		// browserTabsWrapperEl.addEventListener("drop", handleDrop, false);
	};

	var handleDrop = function(e) {
		console.log(e);

	};

	/**
	 * enable sliding/fade animation for browser tabs
	 */
	var enableAnimation = function() {
		browserTabsWrapperEl.classList.add("animate");
	};

	/**
	 * disable sliding/fade animation for browser tabs
	 */
	var disableAnimation = function() {
		browserTabsWrapperEl.classList.remove("animate");
	};

	/**
	 * adjust each tab's width based on number of tabs and window size
	 */
	var adjustWidth = function() {
		tabWidth = Math.floor((browserTabsWrapperEl.clientWidth - addTabBtnEl.offsetWidth) / numOpenTabs);
		tabWidth = (tabWidth > 200) ? 200 : tabWidth;

		var allTabsEl = browserTabsWrapperEl.querySelectorAll(navTabSelector);

		// adjust tab add button's position first since this will kick off animation
		addTabBtnEl.style.left = (tabWidth * allTabsEl.length) + "px";

		for (var i = 0; i < allTabsEl.length; i++) {
			allTabsEl[i].style.left = (tabWidth * i) + "px";
			allTabsEl[i].style.width = tabWidth + "px";
		}
	};


	/* ====================================
	 public methods
	 ====================================== */
	/**
	 * create and add a new tab
	 */
	_this.createTab = function(tabViewId, title) {
		var newTab = new BrowserTab(hackBrowserWindow, tabViewId, title);
		var newTabEl = newTab.getTabEl();

		// increase open tabs count
		numOpenTabs++;

		browserTabsWrapperEl.insertBefore(newTabEl, addTabBtnEl);

		// temporarily disable animation
		disableAnimation();

		// adjust css accordingly (each tab's width)
		// adjustWidth();

		// TODO: check if there is any way to avoid using setTimeout here
		setTimeout(enableAnimation, 10);
		// enable animation back on
		// enableAnimation();

		return newTab;
	};

	/**
	 * remove a specific tab by tabViewId
	 *
	 * @param tabViewId {string} ID of TabView object to be removed from tabs
	 */
	_this.removeTab = function(tabViewId) {
		var tabEl = browserTabsWrapperEl.querySelector("[data-webview-id='" + tabViewId + "']");
		var tabIndex = Array.prototype.indexOf.call(browserTabsWrapperEl.querySelectorAll(navTabSelector), tabEl);

		hackBrowserWindow.handleTabCloseById(tabViewId);

		browserTabsWrapperEl.removeChild(tabEl);
		numOpenTabs--;

		// adjustWidth();

		var tabIdToActivate;

		var openTabsElArr = browserTabsWrapperEl.querySelectorAll(navTabSelector);

		if (tabIndex >= openTabsElArr.length) {
			tabIdToActivate = openTabsElArr[tabIndex - 1].dataset.webviewId;
		} else {
			tabIdToActivate = openTabsElArr[tabIndex].dataset.webviewId;
		}

		hackBrowserWindow.activateTabById(tabIdToActivate);
	};

	init();
}
