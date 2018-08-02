const { ipcMain, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');
let isRun = false;
const $windows = [];

module.exports = class Screenshot {
  constructor() {
    if(isRun) return;
    isRun = true;

    this.isClose = false;

    ipcMain.on('screenshot', (e, source) => {
      this.closeWindow();
      this.createWindow(source);
    });
  }

  createWindow(source) {
    if($windows.length) return;

    console.log(path.join(__dirname, './screenshot.html'));
    console.log(path.join(__dirname, './imageRect.js'));

    const $win = new BrowserWindow({
      fullscreen: true,// TODO: 需要变为true
      width: 900,
      height: 800,
      alwaysOnTop: true,
      skipTaskbar: false,
      autoHideMenuBar: true,
      show: false,
      webPreferences: {
        webSecurity: false,
        nodeIntegration: true,
        plugins: true,
        preload: path.join(__dirname, './imageRect.js')
      }
    });
    $win.on('close', e => {
      this.closeWindow();
    });

    $win.once('ready-to-show', () => {
      console.log('ready-to-show');
      $win.show()
      $win.focus()
    });

    $win.webContents.on('dom-ready', () => {
      console.log('dom-ready');
      //$win.webContents.executeJavaScript(`window.source = ${JSON.stringify(source)}`)
      $win.webContents.send('dom-ready')
      $win.focus()
    });

    $win.loadURL(url.format({
      pathname: path.join(__dirname, './screenshot.html'),
      protocol: 'file:',
      slashes: true
    }));
    $windows.push($win);
  }

  closeWindow () {
    this.isClose = true
    while ($windows.length) {
      const $winItem = $windows.pop()
      $winItem.close()
    }
    this.isClose = false
  }
}
