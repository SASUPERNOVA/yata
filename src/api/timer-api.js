const { PriorityQueue } = require('../utils/priority-queue');
const { contextBridge } = require('electron');

let timerQueue = new PriorityQueue();
let refIds = {};
let pauseRef = null;

const pollQueue = () => {
    let time = new Date();

    if (time.getTime() >= timerQueue.minKey) {
        let refId = timerQueue.getFront();
        refIds[refId].page.dispatchEvent(new CustomEvent('timer-finished', {detail: refId}));
    }
}

let timer = setInterval(pollQueue, 1000);

contextBridge.exposeInMainWorld('timerAPI', {
    setTimer: (message) => {
        const { time, page, refId } = message;
        if (refIds[refId]) {
            timerQueue.remove(refId, refIds[refId].time);
        }
        timerQueue.put(refId, time);
        refIds[refId] = {time, page};
    },
    pauseTimer: (target) => {
        if (!pauseRef) {
            pauseRef = target;
            clearInterval(timer);
        }
    },
    resumeTimer: (target) => {
        if (pauseRef == target) {
            pauseRef = null;
            timer = setInterval(pollQueue, 1000);
        }
    }
});