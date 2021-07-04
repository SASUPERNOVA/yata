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
            this.props.timeInput.addEventListener('change', (ev) => this.onTimeChange(ev));
            this.props.toggleSwitch.addEventListener('change', ev => this.alarmSet(ev));
            this.props.soundInput.addEventListener('input', ev => this.dispatchEvent(new Event('input')));
            this.addEventListener('ring-alarm', async (ev) => this.onRingAlarm(ev));
        }

        async onRingAlarm(ev) {
            const timeDiff = new Date().getTime() - this.getDate().getTime();
            if (timeDiff < 60000 && !this.modal) {
                timerAPI.pauseClock();
                if (this.props.titleInput.value || this.props.bodyInput.value) {
                    new Notification(this.props.titleInput.value, { body: this.props.bodyInput.value });
                }
                if (this.props.soundInput.value) {
                    this.modal = document.createElement('alarm-modal');
                    const body = document.querySelector('body');
                    body.appendChild(this.modal);
                    const audio = new Audio(this.props.soundInput.value);
                    audio.loop = true;
                    audio.play();
                    this.modal.addEventListener('close', () => {
                        body.removeChild(this.modal);
                        audio.pause();
                        delete this.modal;
                        timerAPI.resumeClock();
                    });
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
            const hours = date.getHours().toString().padStart(2, '0');
            const minutes = date.getMinutes().toString().padStart(2, '0')
            this.props.timeInput.value = `${hours}:${minutes}`;
            this.props.toggleSwitch.onShadowRootReady(() => {
                this.props.toggleSwitch.checked = state.toggleSwitch;
            });
            this.props.soundInput.onShadowRootReady(() => {
                this.props.soundInput.value = state.soundInput;
                const extensions = ['wav', 'mp3', 'mp4', 'aac', 'ogg', 'webm', 'caf', 'flac'];
                this.props.soundInput.setOptions({filters: [{name: 'Audio Files', extensions: extensions}, {name: 'All Files', extensions: ['*']}]});
            });
            this.props.titleInput.value = state.titleInput;
            this.props.bodyInput.value = state.bodyInput;
            if (state.toggleSwitch) {
                this.setTimer();
            }
        }

        onTimeChange(ev) {
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

        deleteClick(ev) {
            const host = this.hostComponent();
            this.remove();
            host.dispatchEvent(new CustomEvent('child-removed'));
        }

        setTimer() {
            let date = this.getDate();
            const message = {
                time: date.getTime(),
                page: this.hostComponent(),
                refId: this.getAttribute('ref-id')
            }
            timerAPI.addTimer(message);
        }

        getDate() {
            const time = this.props.timeInput.value.split(':');
            const date = new Date();
            date.setHours(time[0], time[1], 0);
            
            return date;
        }
    }

    customElements.define('alarm-component', Alarm);
})();