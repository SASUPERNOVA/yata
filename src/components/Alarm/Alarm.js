(() => {
    class Alarm extends WebComponent {
        constructor() {
            super('components/Alarm/Alarm.html', 'alarm-component');
        }

        async connectedCallback() {
            await super.connectedCallback();
            this.setRefId(this.genURefId());
            this.shadowRoot.querySelector('#delete-button').addEventListener('click', (ev) => this.deleteClick(ev));
            this.props = {
                timeInput: this.shadowRoot.querySelector('#time-input'),
                toggleSwitch: this.shadowRoot.querySelector('toggle-switch'),
                soundInput: this.shadowRoot.querySelector('#sound-input'),
                titleInput: this.shadowRoot.querySelector('#title-input'),
                bodyInput: this.shadowRoot.querySelector('#body-input')
            }
            this.initSoundInput();
            this.props.timeInput.addEventListener('change', (ev) => this.onTimeChange(ev));
            this.props.toggleSwitch.addEventListener('change', (ev) => this.alarmSet(ev));
            this.props.soundInput.addEventListener('input', (_ev) => this.dispatchEvent(new Event('input')));
            this.addEventListener('ring-alarm', (ev) => this.onRingAlarm(ev));
        }

        onRingAlarm(_ev) {
            const timeDiff = new Date().getTime() - this.getDate().getTime();
            let notification;
            if (timeDiff < toMilliseconds(1, TimeType.MINUTE) && !document.modal) {
                timerAPI.pauseClock(this);
                if (this.props.titleInput.value || this.props.bodyInput.value) {
                    notification = new Notification(this.props.titleInput.value, { body: this.props.bodyInput.value });
                }
                if (this.props.soundInput.value) {
                    document.modal = document.createElement('alarm-modal');
                    const body = document.querySelector('body');
                    body.appendChild(document.modal);
                    const audio = new Audio(this.props.soundInput.value);
                    audio.loop = true;
                    audio.play();
                    document.modal.addEventListener('close', () => {
                        body.removeChild(document.modal);
                        audio.pause();
                        delete document.modal;
                        timerAPI.resumeClock(this);
                    });
                    notification.addEventListener('click', () => {
                        body.removeChild(document.modal);
                        audio.pause();
                        delete document.modal;
                        timerAPI.resumeClock(this);
                    })
                }
            }
        }

        getState() {
            return {
                timeInput: this.getDate().getTime(),
                toggleSwitch: this.props.toggleSwitch.checked,
                soundInput: this.props.soundInput.value,
                titleInput: this.props.titleInput.value,
                bodyInput: this.props.bodyInput.value
            }
        }

        setState(state) {
            const date = new Date(state.timeInput);
            const time = getFullTime(date);
            this.props.timeInput.value = `${time.slice(0, time.lastIndexOf(':'))}`;
            this.props.toggleSwitch.onShadowRootReady(() => {
                this.props.toggleSwitch.checked = state.toggleSwitch;
            });
            this.props.soundInput.onShadowRootReady(() => {
                this.props.soundInput.value = state.soundInput ? state.soundInput : 'media/alarm-sound.flac';
                this.initSoundInput();
            });
            this.props.titleInput.value = state.titleInput;
            this.props.bodyInput.value = state.bodyInput;
            if (state.toggleSwitch) {
                this.setTimer();
            }
        }

        onTimeChange(_ev) {
            if (!this.props.toggleSwitch.checked) {
                return;
            }
            this.setTimer();
        }

        alarmSet(ev) {
            if (ev.target.checked) {
                this.setTimer();
            }
            else {
                timerAPI.removeTimer(this.refId);
            }
        }

        deleteClick(_ev) {
            const host = this.hostComponent();
            this.remove();
            host.dispatchEvent(new CustomEvent('child-removed'));
        }

        setTimer() {
            let date = this.getDate();
            const message = {
                time: date.getTime(),
                page: this.hostComponent(),
                refId: this.refId
            }
            timerAPI.addTimer(message);
        }

        getDate() {
            const time = this.props.timeInput.value.split(':');
            const date = dateFromTime({ hours: time[0], minutes: time[1]});
            
            return date;
        }

        initSoundInput() {
            const extensions = ['wav', 'mp3', 'mp4', 'aac', 'ogg', 'webm', 'caf', 'flac'];
            this.props.soundInput.setOptions({filters: [{name: 'Audio Files', extensions: extensions}, {name: 'All Files', extensions: ['*']}]});
        }
    }

    customElements.define('alarm-component', Alarm);
})();