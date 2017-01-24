// Load in dependencies
var Menu = require('electron').Menu;

// Load in JSON for menus (e.g. `./menus/linux.json`)
var menuTemplate = require('./menus/' + process.platform + '.json');

// Define a function to set up application menu
exports.init = function (gme) {
  // Parse and set up menu
  function bindMenuItems(menuItems) {
    menuItems.forEach(function bindMenuItemFn (menuItem) {
      // If there is a role, continue
      if (menuItem.role !== undefined) {
        return;
      }

      // If there is a separator, continue
      if (menuItem.type === 'separator') {
        return;
      }

      // If there is a submenu, recurse it
      if (menuItem.submenu) {
        bindMenuItems(menuItem.submenu);
        return;
      }

      // Otherwise, find the function for command
      var cmd = menuItem.command;
      if (cmd === 'application:about') {
        menuItem.click = gme.openAboutWindow;
      } else if (cmd === 'application:show-settings') {
        menuItem.click = gme.openConfigWindow;
      } else if (cmd === 'application:quit') {
        menuItem.click = gme.quitApplication;
      } else if (cmd === 'window:reload') {
        menuItem.click = gme.reloadWindow;
      } else if (cmd === 'window:toggle-dev-tools') {
        menuItem.click = gme.toggleDevTools;
      } else if (cmd === 'window:toggle-full-screen') {
        menuItem.click = gme.toggleFullScreen;
      } else {
        throw new Error('Could not find function for menu command "' + cmd + '" ' +
          'under label "' + menuItem.label + '"');
      }
    });
  }
  bindMenuItems(menuTemplate.menu);
  Menu.setApplicationMenu(Menu.buildFromTemplate(menuTemplate.menu));
};
