const { contextBridge, ipcRenderer } = require('electron');
require('./notify-preload');

contextBridge.exposeInMainWorld('yanuAPI', {
    saveFile: (fileName, data) => {
        ipcRenderer.send('save-file', fileName, data);
    },
    loadFile: (fileName) => {
        ipcRenderer.send('load-file', fileName);
    },
    openFileDialog: async (options) => {
        let files = await ipcRenderer.invoke('file-dialog-open', options);
        return files;
    }
});

ipcRenderer.on('save-failed', (event, err) => {
    console.log(err);
});

ipcRenderer.on('load-failed', (event, err) => {
    console.log(err);
});

ipcRenderer.on('load-success', (event, data) => {
    document.dispatchEvent(new CustomEvent('data-received', {detail: data}));
});