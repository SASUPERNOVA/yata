const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1024,
    height: 800,
    icon: path.join(__dirname, 'Dummy.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true
    }
  });
  //mainWindow.removeMenu();

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

ipcMain.on('save-file', (event, fileName, data) => {
  fs.writeFile(path.join(__dirname, fileName), JSON.stringify(data, null, ' '), (err) => {
    if (err) {
      event.sender.send('save-failed', err);
    }
  });
});

ipcMain.on('load-file', (event, fileName) => {
  fs.readFile(path.join(__dirname, fileName), (err, data) => {
    if (err) {
      event.sender.send('load-failed', err);
    }
    else {
      event.sender.send('load-success', JSON.parse(data));
    }
  });
});

ipcMain.handle('file-dialog-open', async (event, options) => {
  const fileDialog = await dialog.showOpenDialog(BrowserWindow.getFocusedWindow(), options);
  if (!fileDialog.canceled) {
    return fileDialog.filePaths;
  }
});