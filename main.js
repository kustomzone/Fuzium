
const { electron, app, BrowserWindow, crashReporter, ipcMain, Menu, protocol, remote } = require('electron')
const url       = require('url')
const path      = require('path')
const debugMenu = require('debug-menu')

// var spawn          = require('child_process').spawn;
// var electronPath   = require('electron-prebuilt'); 
// const createOSMenu = require('./app/os-menu')
// var window         = remote.getCurrentWindow();

let mainWindow

var mainAddr = 'http://127.0.0.1:43110/1HeLLo4uzjaLetFx6NH3PMwFP3qbRbTf3D'

function createWindow() {
	var fuzium = require('child_process').spawn('./app/bin/ZeroNet.exe')
	
	mainWindow = new BrowserWindow({
		webbrowser: 'electron',
		title:        'Fuzium',
        width:           1024,
        height:           768,
        frame:           true,
		transparent:     true,
		autoHideMenuBar: true,
		titleBarStyle: 'hidden-inset',
        icon: __dirname + './app/icons/app.ico'
    })
	
	const menu = Menu.buildFromTemplate([
    {
        label: 'Menu',
        submenu: [
          {
            label: 'About',
            click () { require('electron').shell.openExternal('https://github.com/kustomzone/Fuzium/blob/master/README.md') }
          }
        ]
    },
    {
        label: 'View',
        submenu: [
          {
            role: 'minimize'
          },
          {
            type: 'separator'
          },
          {
            role: 'togglefullscreen'
          }
        ]
    },
    {
        label: 'Debug',
        submenu: debugMenu.windowDebugMenu(mainWindow)
    }]);
	
	// mainWindow.setMenu(null)
	
    if (process.platform !== 'darwin') {
        mainWindow.setMenu(menu);
    } else {
        electron.Menu.setApplicationMenu(menu);
    }
	
	// createOSMenu();
	
	console.log('creating main window...');
	
	mainWindow.webContents.on('new-window', function(event, urlToOpen) {
       event.preventDefault(); // event.defaultPrevented = true;
    });
	
    mainWindow.loadURL(mainAddr)
	// mainWindow.loadURL(`file://${__dirname}/app/browser.html`)
	// mainWindow.webContents.openDevTools()
	
    mainWindow.on('closed', function() {
		mainWindow = null
		zeron.kill('SIGINT')
    });
	
	// Set download folder 
	mainWindow.webContents.session.on('will-download', (event, item, webContents) => {
     // Set the save path, making Electron not to prompt a save dialog
     item.setSavePath('download/'+item.getFilename())
	 
	 // track download
     item.on('updated', (event, state) => {
      if (state === 'interrupted') {
        console.log('Download is interrupted but can be resumed')
      } else if (state === 'progressing') {
       if (item.isPaused()) {
         console.log('Download is paused')
       } else {
         console.log(`Received bytes: ${item.getReceivedBytes()}`)
       }
      }
     })
     item.once('done', (event, state) => {
      if (state === 'completed') {
        console.log('Completed. Check your app download folder')
      } else {
        console.log(`Download failed: ${state}`)
      }
     })
    })
}

app.on('ready', function() {
    createWindow();
});

app.on('window-all-closed', function() {
	if (process.platform != 'darwin') { 
      app.quit();
	}
});

crashReporter.start( {
  productName: 'Zeron',
  companyName: 'Kustomzone',
  submitURL: 'https://kustomzone.com/report',
  autoSubmit: false
});
