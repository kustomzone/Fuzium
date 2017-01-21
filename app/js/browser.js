// Load in dependencies
var ipcRenderer = require('electron').ipcRenderer;
var webContents = require('electron').remote.getCurrentWebContents();
var Watcher     = require('file-watcher');

// When the DOM loads
window.addEventListener('DOMContentLoaded', function handleDOMLoad () {
  // Find attachment point for nav buttons
  var leftNavContainer = document.querySelector('.top > #material-one-left');
  var navOpenEl = leftNavContainer ? leftNavContainer.querySelector('#left-nav-open-button') : null;

  // If there is one
  if (navOpenEl) {
    // Generate buttons
    var nodeName = navOpenEl.nodeName;
    var backEl = document.createElement(nodeName);
    backEl.setAttribute('aria-label', 'Back');
    backEl.setAttribute('icon', 'arrow-back');
    backEl.setAttribute('id', 'func-back-button');
    var forwardEl = document.createElement(nodeName);
    forwardEl.setAttribute('aria-label', 'Forward');
    forwardEl.setAttribute('icon', 'arrow-forward');
    forwardEl.setAttribute('id', 'func-forward-button');

    // Apply one-off styles to repair positioning and padding
    // DEV: Taken from CSS styles on hidden "back" button
    var cssFixes = [
      'align-self: center;',
      'min-width: 24px;'
    ].join('');
    backEl.style.cssText = cssFixes;
    forwardEl.style.cssText = cssFixes;

    // Determine the current size of the menu button
    // 40px -> 40
    var navOpenElWidthStr = window.getComputedStyle(navOpenEl).width;
    var navOpenElWidthPx = parseInt(navOpenElWidthStr.replace(/px$/, ''), 10);

    // Increase the `min-width` for leftNavContainer
    // 226px -> 226 -> 306px
    var leftNavContainerMinWidthStr = window.getComputedStyle(leftNavContainer).minWidth;
    var leftNavContainerMinWidthPx = parseInt(leftNavContainerMinWidthStr.replace(/px$/, ''), 10);
    leftNavContainer.style.minWidth = (leftNavContainerMinWidthPx + (navOpenElWidthPx * 2)) + 'px';

    // Attach event listeners
    backEl.addEventListener('click', function onBackClick () {
      window.history.back();
    });
    forwardEl.addEventListener('click', function onBackClick () {
      window.history.forward();
    });

    // When the page changes, update enabled/disabled navigation
    var updateNavigation = function () {
      if (webContents.canGoBack()) {
        backEl.removeAttribute('disabled');
      } else {
        backEl.setAttribute('disabled', true);
      }
      if (webContents.canGoForward()) {
        forwardEl.removeAttribute('disabled');
      } else {
        forwardEl.setAttribute('disabled', true);
      }
    };
    window.addEventListener('hashchange', updateNavigation);
    updateNavigation();
    // Expose buttons adjacent to the hidden back element
    navOpenEl.parentNode.insertBefore(forwardEl, navOpenEl.nextSibling);
    navOpenEl.parentNode.insertBefore(backEl, forwardEl);
    console.info('Added navigation buttons');

    var musicLogoContainer = leftNavContainer.querySelector('.music-logo-link');
    var musicLogoEl = musicLogoContainer.querySelector('.music-logo');
    var updateLogoDisplay = function () {
      var displayVal = window.getComputedStyle(musicLogoEl).display;
      musicLogoContainer.style.display = displayVal === 'none' ? 'none' : 'initial';
    };
    var musicLogoObserver = new MutationObserver(function handleMutations (mutations) {
      mutations.forEach(function handleMutation (mutation) {
        var targetEl = mutation.target;
        if (targetEl === musicLogoEl) {
          updateLogoDisplay();
        }
      });
    });
    musicLogoObserver.observe(musicLogoEl, {
      attributes: true
    });

    // Update music logo immediately as it starts as `display: none` on page refresh
    updateLogoDisplay();

    // Notify user of changes
    console.info('Added monitor for music logo visibility');
  } else {
    console.error('Failed to find navigation button');
  }
});

// When we finish loading
// DEV: We must wait until the UI fully loads otherwise mutation observers won't bind
// DEV: Even with the `onload` event, we still could not have JS fully loaded so use a setTimeout loop
var loadAttempts = 0;
function handleLoad() {
  // Try to bind Watcher to the UI
  var fileWatcher;
  try {
    fileWatcher = new Watcher(window);
      root: __dirname,
      filter: function(filename, stats) {
        // only watch those files 
        if(filename.indexOf('.styl') != -1) {
            return true;
        }
        else {
            return false;
        }
      }
    });
    fileWatcher.on('...', function() { /* Watcher is an EventEmitter */ });
    fileWatcher.watch();
    console.info('Successfully initialized `Watcher`');
  // If there was an error
  } catch (err) {
    // If this is 60th attempt (i.e. 1 minute of failures), then throw the error
    if (loadAttempts > 60) {
      throw err;
    // Otherwise, try again in 1 second
    } else {
      console.info('Failed to initialize `Watcher`. Trying again in 1 second');
      loadAttempts += 1;
      return setTimeout(handleLoad, 1000);
    }
  }

  // Forward events over `ipc`
  var events = ['change:song', 'change:playback', 'change:playback-time'];
  events.forEach(function bindForwardEvent (event) {
    fileWatcher.on(event, function forwardEvent (data) {
      // Send same event with data (e.g. `change:song` `Watcher.Playback.PLAYING`)
      ipcRenderer.send(event, data);
    });
  });

  /*
  // Config control
  ipcRenderer.on('control:play-pause', function handlePlayPause (evt) {
    fileWatcher.playback.playPause();
  });
  ipcRenderer.on('control:next', function handleNext (evt) {
    fileWatcher.playback.forward();
  });
  ipcRenderer.on('control:previous', function handlePrevious (evt) {
    fileWatcher.playback.rewind();
  });
  */

}

window.addEventListener('load', handleLoad);
