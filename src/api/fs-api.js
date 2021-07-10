const { contextBridge, ipcRenderer } = require('electron');
const { exec } = require('child_process');

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
    },
    run: (command, args='') => {
        exec(`${command}${args ? ' ' : ''}${args}`, (error, _stdout, stderr) => {
            if (error) {
                console.error(`error: ${error}`);
            }
            if (stderr) {
                console.error(`stderr: ${stderr}`);
            }
        });
    }
});

ipcRenderer.on('save-failed', (event, err) => {
    console.log(err);
});