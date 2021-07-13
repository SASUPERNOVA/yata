const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 1024,
    height: 800,
    icon: path.join(__dirname, 'Dummy.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true
    }
  });
  mainWindow.loadFile(path.join(__dirname, 'index.html'));
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.on('save-file', (event, fileName, data) => {
  fs.writeFile(path.join(__dirname, fileName), JSON.stringify(data, null, ' '), (err) => {
    if (err) {
      event.sender.send('save-failed', err);
    }
  });
});

ipcMain.handle('load-file', async (event, fileName) => {
  try {
    const data = await fs.promises.readFile(path.join(__dirname, fileName));
    return JSON.parse(data);
  }
  catch (err) {
    throw err;
  }
});

ipcMain.handle('file-dialog-open', async (event, options) => {
  const fileDialog = await dialog.showOpenDialog(BrowserWindow.getFocusedWindow(), options);
  if (!fileDialog.canceled) {
    return fileDialog.filePaths;
  }
});