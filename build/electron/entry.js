/**
 * 一个简单的套壳electron应用入口
 * 本质上是加载远程url
 */

const { app, BrowserWindow } = require('electron');

const isProd = process.env.NODE_ENV === 'production';
const url =
  isProd === true ? 'https://trpg.moonrailgun.com' : 'http://127.0.0.1:8089';

let window = null;
// Wait until the app is ready
app.once('ready', () => {
  // Create a new window
  window = new BrowserWindow({
    width: 1280,
    height: 720,
    minWidth: 375,
    center: true,
    // Don't show the window until it ready, this prevents any white flickering
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      // Disable node integration in remote page
      nodeIntegration: false,
    },
  });

  window.loadURL(url);

  // Show window when page is ready
  window.once('ready-to-show', () => {
    // window.maximize();
    window.show();
  });
});

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (window === null) {
    createWindow();
  }
});
