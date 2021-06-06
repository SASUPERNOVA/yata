const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('yanuAPI', {
    dummy: () => {
        console.log('I am a dummy');
    }
})