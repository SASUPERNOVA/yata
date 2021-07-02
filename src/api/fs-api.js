const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('fsAPI', {
    saveFile: (fileName, data) => {
        ipcRenderer.send('save-file', fileName, data);
    },
    loadFile: async (fileName) => {
        try {
            const data = await ipcRenderer.invoke('load-file', fileName);
            return data;
        }
        catch (err) {
            console.log(err);
        }
    },
    openFileDialog: async (options) => {
        let files = await ipcRenderer.invoke('file-dialog-open', options);
        return files;
    }
});

ipcRenderer.on('save-failed', (event, err) => {
    console.log(err);
});