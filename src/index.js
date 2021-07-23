const { app, BrowserWindow, ipcMain, dialog, Menu, Tray } = require('electron');
const path = require('path');
const fs = require('fs');

if (require('electron-squirrel-startup')) {
  app.quit();
}

let appTray;
const config = getConfig();

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 1024,
    height: 800,
    icon: path.join(__dirname, 'media', 'yata.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true
    }
  });
  if (!app.commandLine.hasSwitch('debug')) {
    mainWindow.removeMenu();
  }
  mainWindow.loadFile(path.join(__dirname, 'index.html'));
  fs.mkdir(path.join(__dirname, 'userData'), {recursive: true}, (err) => {
    if (err) {
      throw err;
    }
  });

  mainWindow.on('close', (ev) => {
    if (!app.mustQuit && config.useTray) {
      mainWindow.hide();
      mainWindow.setSkipTaskbar(true);
      ev.preventDefault();
    }
  });

  appTray = new Tray(path.join(__dirname, 'media', 'yata.png'));
  const contextMenu = Menu.buildFromTemplate([
    {label: 'Open', type: 'normal', click: () => {
      mainWindow.restore();
      mainWindow.setSkipTaskbar(false);
    }},
    {label: 'Quit', type: 'normal', click: () => {
      app.mustQuit = true;
      app.quit();
    }}
  ]);
  appTray.setContextMenu(contextMenu);
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

function getConfig() {
  const configPath = path.join(__dirname, 'userData', 'config.json');
  if (fs.existsSync(configPath)) {
    let config = fs.readFileSync(configPath);
    config = JSON.parse(config);
    return config;
  }
  else {
    const defaultConfig = {
      useTray: process.platform == 'win32' || process.platform == 'darwin'
    };
    fs.writeFile(configPath, JSON.stringify(defaultConfig, null, ' '), (err) => {
      if (err) {
        throw err;
      }
    })

    return defaultConfig;
  }
}

ipcMain.on('save-file', (event, fileName, data) => {
  fs.writeFile(path.join(__dirname, 'userData', fileName), JSON.stringify(data, null, ' '), (err) => {
    if (err) {
      event.sender.send('save-failed', err);
    }
  });
});

ipcMain.handle('load-file', async (_event, fileName) => {
  try {
    const data = await fs.promises.readFile(path.join(__dirname, 'userData', fileName));
    return JSON.parse(data);
  }
  catch (err) {
    throw err;
  }
});

ipcMain.handle('file-dialog-open', async (_event, options) => {
  const fileDialog = await dialog.showOpenDialog(BrowserWindow.getFocusedWindow(), options);
  if (!fileDialog.canceled) {
    return fileDialog.filePaths;
  }
});
