// Load in dependencies
var Tray     = require('electron').Tray;
var ipcMain  = require('electron').ipcMain;
var Menu     = require('electron').Menu;
var MenuItem = require('electron').MenuItem;
var Watcher  = require('file-watcher');
var appIcons = require('../gfx/icons');

// Shorten tooltips
function truncateStr(str, len) {
  // If the string is over the length, then truncate it
  // DEV: We go 1 under length so we have room for ellipses
  if (str.length > len) {
    return str.slice(0, len - 2) + '…';
  }
  return str;
}

// Set tray icon
exports.init = function (func) {
  var trayMenu = new Menu();
  
  trayMenu.append(new MenuItem({
    label: 'Show/hide window',
    click: func.onTrayClick
  }));
  trayMenu.append(new MenuItem({
    type: 'separator'
  }));
  trayMenu.append(new MenuItem({
    label: 'Quit',
    click: func.quitApplication
  }));
  var tray = new Tray(appIcons['icon-32']);
  
  tray.setContextMenu(trayMenu);

  // Tray clicked; toggle visibility
  tray.on('clicked', func.onTrayClick);

  // State change; update tooltip
  ipcMain.on('change:state', function handlestateChange(evt, stateInfo) {
    func.logger.debug('Updating tray tooltip', {
      stateInfo: stateInfo
    });
    // Max length of 127 chars on Windows
    var infoStr = [
      truncateStr('Zeronet :', 9),
      truncateStr('Electron:', 9)
    ].join('\n');
    tray.setToolTip(infoStr);
  });

  // Config change; update icon
  ipcMain.on('change:config', function handlePlaybackChange(evt, configState) {
    func.logger.debug('Updating tray icon; Config -', {
      configState: configState
    });
    var icon = appIcons['icon-32'];
    // if (configState === Watcher.open) {
    //   icon = appIcons['icon-open-32'];
    // } else if (configState === Watcher.closed) {
    //   icon = appIcons['icon-closed-32'];
    // }
    tray.setImage(icon);
  });
};
