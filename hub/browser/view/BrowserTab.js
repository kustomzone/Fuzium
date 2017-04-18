'use strict';

/**
 * Browser tab and related control
 *
 * @param hackBrowserWindow
 * @param tabViewId
 * @param title
 * @constructor
 */
function BrowserTab(hackBrowserWindow, tabViewId, title) {
	var _this = this;
	
	const logger = require('electron').remote.getGlobal('__app').logger; 

	/* ====================================
	 private member variables
	 ====================================== */
	var tabEl;
	var tabFaviconWrapperEl;
	var tabFaviconEl;
	var tabLoadingSpinnerEl;
	var tabCloseBtnEl;
	var tabInnerTemplate;


	/* ====================================
	 private methods
	 ====================================== */
	var init = function() {
		tabInnerTemplate = '<div class="favicon-wrapper"><img class="favicon"><div class="loader"></div></div><span class="title">{{title}}</span><div class="close"><i class="icon ion-close"></i></div>';

		// Create a container for new tab
		tabEl = document.createElement("div");

		// Save <webview> tag's id value to data-webview-id attribute
		tabEl.setAttribute("data-webview-id", tabViewId);

		// Enable dragging
		// tabEl.setAttribute("draggable", true);

		tabEl.classList.add("nav-tab");

		// replace title with url (until title is set)
		var tabTitle = title ? title : "New Tab";

		tabEl.innerHTML = tabInnerTemplate.replace("{{title}}", tabTitle);

		// save references to favicon-related elements and close button
		tabFaviconWrapperEl = tabEl.querySelector("favicon-wrapper");
		tabFaviconEl = tabEl.querySelector("img.favicon");
		tabLoadingSpinnerEl = tabEl.querySelector(".loader");
		tabCloseBtnEl = tabEl.querySelector(".close");

		attachEventHandlers();
	};

	/**
	 * attach event handlers for menu bar buttons
	 */
	var attachEventHandlers = function() {
		// activate tab by clicking on it
		tabEl.addEventListener("click", function(e) {
			hackBrowserWindow.activateTabById(tabViewId);
		});

		// "close tab" button
		tabCloseBtnEl.addEventListener("click", function(e) {
			_this.close();

			// stop propagation to prevent activate() being called after tabview being closed
			e.stopPropagation();
			e.preventDefault();
		}, false);

		// in case favicon src was invalid, display blank image
		// TODO: adjust position to reduce left padding?
		tabFaviconEl.addEventListener("error", function(e) {
			tabFaviconEl.src = "";
		});

		// drag tab to change position
		/*
		tabEl.addEventListener("dragstart", handleDragStart, false);
		tabEl.addEventListener("drag", handleDrag, false);
		tabEl.addEventListener("dragenter", handleDragEnter, false);
		tabEl.addEventListener("dragover", handleDragOver, false);
		tabEl.addEventListener("dragleave", handleDragLeave, false);
		tabEl.addEventListener("drop", handleDrop, false);
		tabEl.addEventListener("dragend", handleDragEnd, false);
		*/
	};

	var handleDragStart = function(e) {
		console.log("handleDragStart");

		// retrieve left position of the browser tab element
		var tabStyle = window.getComputedStyle(e.target, null);
		var leftPosition = parseInt(tabStyle.getPropertyValue("left"), 10);

		var dragTransparentImage = document.createElement("img");
		dragTransparentImage.width = 0;
		dragTransparentImage.height = 0;

		e.dataTransfer.setData("text/plain", leftPosition);
		e.dataTransfer.setDragImage(dragTransparentImage, 0, 0);

		// since dragstart event prevents click events,
		// the tab is not activated until dragend event occurs
		// activate the tab immediately
		activateSelf();

		logger.log('handleDragStart'); 
	};

	var handleDrag = function(e) {
		console.log("handleDrag");
		console.log(e); 

		e.target.style.left = e.clientX + "px";

		// console.log(e);
	};

	var handleDrop = function(e) {
		// console.log("handleDrop");
		// console.log(e);
	};

	var handleDragEnter = function(e) {
		// console.log("handleDragEnter");
		// console.log(e);
	};

	var handleDragOver = function(e) {
		// console.log("handleDragOver");
		// console.log(e);
	};

	var handleDragLeave = function(e) {
		// console.log("handleDragLeave");
		// console.log(e);
	};

	var handleDragEnd = function(e) {
		// console.log("handleDragEnd");
		// console.log(e);
	};

	var activateSelf = function() {
		hackBrowserWindow.activateTabById(tabViewId);
	};

	/* ====================================
	 public methods
	 ====================================== */

	_this.activate = function() {
		tabEl.classList.add("active");
	};

	_this.deactivate = function() {
		tabEl.classList.remove("active");
	};

	_this.updateTabFavicon = function(imageURL) {
		tabFaviconEl.setAttribute("src", imageURL);
		tabLoadingSpinnerEl.style.display = "none";
		tabFaviconEl.style.display = "block";
	};

	_this.startLoading = function() {
		tabFaviconEl.style.display = "none";
		tabLoadingSpinnerEl.style.display = "block";
	};

	_this.startLoadCommit = function() {
		// TODO: possibly change spinner direction & color when load-commit begins
	};

	_this.stopLoading = function() {
		tabLoadingSpinnerEl.style.display = "none";
		tabFaviconEl.style.display = "block";
	};

	_this.updateTitle = function(title) {
		tabEl.querySelector(".title").innerText = title;
	};

	_this.close = function() {
		hackBrowserWindow.getBrowserTabBar().removeTab(tabViewId);
	};

	/**
	 * Create and add a new tab to browser window's tabs
	 */
	_this.getTabEl = function() {
		return tabEl;
	};

	init();
}
