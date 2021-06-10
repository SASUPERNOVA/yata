// const time_input = document.getElementById('time_input');
// const sound_input = document.getElementById('sound_input');
// const title_input = document.getElementById('title_input');
// const body_input = document.getElementById('body_input');
// const confirm = document.getElementById('confirm');
// const stop = document.getElementById('stop');
// let notifyInteval = null;
// let audio = null;

// confirm.addEventListener('click', () => {
//     if (time_input.value) {
//         notifyInteval = setInterval(notify, 1000);
//     }
//     new Notification('Success!!!', {body: 'Look papa, I succeeded!!!'});
// });

// stop.addEventListener('click', dismiss);

// function notify() {
//     const notify_time = time_input.value.split(':');
//     now = new Date();
//     if (parseInt(notify_time[0]) === parseInt(now.getHours()) && parseInt(notify_time[1]) === parseInt(now.getMinutes())) {
//         let title = title_input.value || 'Good morning sunshine!!!';
//         let body = body_input.value || 'Get dressed and head out!!!';
//         const notification = new Notification(title, {
//             body: body
//           });
//         notification.addEventListener('click', dismiss);
//         notification.addEventListener('close', dismiss);
//         clearInterval(notifyInteval);
//         if (sound_input.files.length) {
//             audio = new Audio(sound_input.files[0].path);
//             audio.play();
//         }
//     }
// }

// function dismiss(ev) {
//     if (ev.notification) {
//         ev.notification.close();
//     }
//     if (!audio.paused) {
//         audio.pause();
//         audio.currentTime = 0;
//     }
// }

(() => {
    let globalNotificationArray = [];
    let pauseRef = null;
    let timer = setInterval(pollGNA, 1000);

    function pollGNA() {
        for (const componentClass of globalNotificationArray) {
            //console.log(componentClass);
        }
    }

    document.addEventListener('register-page', (ev) => {
        let {componentName, className} = ev.detail;
        globalNotificationArray.push({componentName, className});
    });

    document.addEventListener('pause-timer', (ev) => {
        if (!pauseRef) {
            pauseRef = ev.target;
            clearInterval(timer);
        }
    });

    document.addEventListener('resume-timer', (ev) => {
        if (pauseRef == ev.target) {
            pauseRef = null;
            timer = setInterval(pollGNA, 1000);
        }
    });
})();