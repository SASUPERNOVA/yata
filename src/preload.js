const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('yanuAPI', {
    dummy: () => {
        console.log('I am a dummy');
    },
    ping: () => ipcRenderer.send('ping')
});

ipcRenderer.on('pong', () => {
    alert('PONG!!!');
})