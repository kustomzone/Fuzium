'use strict';

/**
 * Find function
 *
 * @param tabView
 * @constructor
 */
function SearchBox(tabView) {
	var _this = this;

	/* ====================================
	 private member variables
	 ====================================== */
	const NO_MATCH_CLASS = "no-match";

	var searchWrapperEl;
	var searchInputEl;
	var matchDisplayEl;
	var ordinalIndexEl;
	var totalCountEl;
	var prevBtnEl;
	var nextBtnEl;
	var closeBtnEl;
	var searchVal;
	var isInputFocusEvent;


	/* ====================================
	 private methods
	 ====================================== */
	var init = function() {
		searchWrapperEl = document.createElement("div");
		searchWrapperEl.classList.add("search-wrapper");
		searchWrapperEl.innerHTML = '<div class="search-input-wrapper"><input type="text" class="search" /><div class="match-display"><span class="ordinal-index">0</span> of <span class="total-count">0</span></div><div class="button-group"><a class="button prev"><i class="icon ion-ios-arrow-up"></i></a><a class="button next"><i class="icon ion-ios-arrow-down"></i></a></div></div><a class="button close"><i class="icon ion-android-close"></i></a>';

		searchInputEl = searchWrapperEl.querySelector("input.search");
		matchDisplayEl = searchWrapperEl.querySelector(".match-display");
		ordinalIndexEl = searchWrapperEl.querySelector(".ordinal-index");
		totalCountEl = searchWrapperEl.querySelector(".total-count");

		prevBtnEl = searchWrapperEl.querySelector(".prev");
		nextBtnEl = searchWrapperEl.querySelector(".next");
		closeBtnEl = searchWrapperEl.querySelector(".close");

		isInputFocusEvent = false;

		attachEventHandlers();
	};

	/**
	 * attach event handlers for 'find-in-page' functionality
	 */
	var attachEventHandlers = function() {
		searchInputEl.addEventListener("keyup", onSearchInputKeyUp);
		prevBtnEl.addEventListener("click", onPrevBtnClick);
		nextBtnEl.addEventListener("click", onNextBtnClick);
		closeBtnEl.addEventListener("click", onCloseBtnClick);
		tabView.getWebViewEl().addEventListener("found-in-page", onFoundInPage);
	};

	/**
	 * event handler for search box key up
	 *
	 * @param e {event} keyup event object
	 */
	var onSearchInputKeyUp = function(e) {
		searchVal = searchInputEl.value;

		if (searchVal == "") {
			hideFindResult();
		} else {
			showFindResult();
		}

		if (e.keyCode === KeyCode.ESC) {				// esc key
			_this.close();
		} else if (e.keyCode === KeyCode.ENTER) {		// enter key
			findNext();
		} else {
			// if the keyup event is not fired from input focus event
			// and searchVal is not blank, find in page
			if (!isInputFocusEvent) {
				if (searchVal) {
					tabView.getWebViewEl().findInPage(searchVal, {});
				}
			} else {
				isInputFocusEvent = false;
			}

		}
	};

	/**
	 * event handler for 'prev' button click
	 *
	 * @param e {event} click event
	 */
	var onPrevBtnClick = function(e) {
		e.preventDefault();

		findPrev();
	};

	/**
	 * event handler for 'next' button click
	 *
	 * @param e {event} click event
	 */
	var onNextBtnClick = function(e) {
		e.preventDefault();

		findNext();
	};

	/**
	 * event handler for 'close' button click
	 *
	 * @param e {event} click event
	 */
	var onCloseBtnClick = function(e) {
		e.preventDefault();

		_this.close();
	};

	/**
	 * find previous search result
	 */
	var findPrev = function() {
		tabView.getWebViewEl().findInPage(searchVal, {
			forward: false,
			findNext: true
		});
	};

	/**
	 * find next search result
	 */
	var findNext = function() {
		tabView.getWebViewEl().findInPage(searchVal, {
			findNext: true
		});
	};

	/**
	 * event handler for 'found-in-page' webContents event
	 *
	 * @param e {event} 'found-in-page' event
	 */
	var onFoundInPage = function(e) {
		if (e.result.hasOwnProperty("activeMatchOrdinal")) {
			updateOrdinalIndex(e.result.activeMatchOrdinal);
		}

		if (e.result.hasOwnProperty("matches")) {
			updateTotalMatchCount(e.result.matches);
		}
	};

	/**
	 * update ordinal index value on 'find-in-page' box
	 *
	 * @param ordinalIndex {integer}  new ordinal index
	 */
	var updateOrdinalIndex = function(ordinalIndex) {
		ordinalIndexEl.innerHTML = ordinalIndex;
	};

	/**
	 * update total match count value on 'find-in-page' box
	 *
	 * @param totalMatchCount {integer}  new total match count
	 */
	var updateTotalMatchCount = function(totalMatchCount) {
		if (totalMatchCount === 0) {
			matchDisplayEl.classList.add(NO_MATCH_CLASS);
		} else {
			matchDisplayEl.classList.remove(NO_MATCH_CLASS);
		}

		totalCountEl.innerHTML = totalMatchCount;
	};

	/**
	 * show ordinal index and total match count
	 */
	var showFindResult = function() {
		matchDisplayEl.style.display = "block";
	};

	/**
	 * hide ordinal index and total match count
	 */
	var hideFindResult = function() {
		matchDisplayEl.style.display = "none";
	};


	/* ====================================
	 public methods
	 ====================================== */
	/**
	 * getter for 'find-in-page' wrapper element
	 *
	 * @returns {DOMElement} 'find-in-page' wrapper element
	 */
	_this.getSearchWrapperEl = function() {
		return searchWrapperEl;
	};

	/**
	 * open 'find-in-page' box
	 */
	_this.open = function() {
		// temporarily set flag to prevent find-in-page running
		// when opening up the search box
		// focusing on input elements will fire keyup event
		isInputFocusEvent = true;

		searchWrapperEl.style.display = "block";
		searchInputEl.focus();
	};

	/**
	 * close 'find-in-page' box
	 */
	_this.close = function() {
		// stop find
		tabView.getWebViewEl().stopFindInPage("clearSelection");

		searchWrapperEl.style.display = "none";
	};



	init();
}