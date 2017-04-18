// exposed controller for communication
var hackBrowserWindow;

(function() {
	'use strict';

	// bootstrap
	var init = function() {
		hackBrowserWindow = new HackBrowserWindow();
		attachEventListeners(); 
	};

	var attachEventListeners = function() {
		document.addEventListener('mousewheel', handleMouseWheel, false);
	}; 

	var handleMouseWheel = function(e) {
		// If ctrl key is pressed, zoom in/out
		if (e.ctrlKey) {
			// If mousewheel downwards, zoom out
			if (e.deltaY > 0) {
				// Zoom out
				hackBrowserWindow.getActiveTabView().zoomOut(); 
			}

			// If mousewheel upwards, zoom in
			else if (e.deltaY < 0) {
				// Zoom in
				hackBrowserWindow.getActiveTabView().zoomIn(); 
			}

			else {
				// Do nothing if no change
			}
		}
	}; 

	if (document.readyState === 'complete' || document.readyState === 'loaded') {
		init();
	} else {
		document.addEventListener('DOMContentLoaded', function() {
			init();
		});
		 
	}
})(); 