const { contextBridge } = require('electron');

let playRef = null;
let audio = new Audio();

contextBridge.exposeInMainWorld('audioAPI', {
    playAudio: (target, src, loop=false) => {
        if (!playRef && audio.paused) {
            playRef = target;
            audio.src = src;
            audio.loop = loop;
            audio.play();
        }
    },
    pauseAudio: (target) => {
        if (playRef == target) {
            audio.pause();
        }
    }
});