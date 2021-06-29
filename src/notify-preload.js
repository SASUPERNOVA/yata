const { PriorityQueue } = require('./utils/priority-queue');
const { contextBridge } = require('electron');

let timerQueue = new PriorityQueue();
let refIds = {};
let pauseRef = null;

const pollQueue = () => {
    let time = new Date();

    if (time >= timerQueue.minKey) {
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
    pauseTimer: () => {
        if (!pauseRef) {
            pauseRef = ev.target;
            clearInterval(timer);
        }
    },
    resumeTimer: () => {
        if (pauseRef == ev.target) {
            pauseRef = null;
            timer = setInterval(pollQueue, 1000);
        }
    }
});