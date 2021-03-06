(() => {
    class Reminder extends WebComponent {
        constructor() {
            super('components/Reminder/Reminder.html');
        }

        async connectedCallback() {
            await super.connectedCallback();
            this.setRefId(this.genURefId());
            this.shadowRoot.querySelector('#delete-button').addEventListener('click', (ev) => this.deleteClick(ev));
            this.props = {
                datetimeInput: this.shadowRoot.querySelector('#datetime-input'),
                toggleSwitch: this.shadowRoot.querySelector('toggle-switch'),
                soundInput: this.shadowRoot.querySelector('#sound-input'),
                repeatInput: this.shadowRoot.querySelector("#repeat-input"),
                repeatTypeInput: this.shadowRoot.querySelector("#repeat-type-input"),
                titleInput: this.shadowRoot.querySelector('#title-input'),
                bodyInput: this.shadowRoot.querySelector('#body-input')
            }
            this.initSoundInput();
            let date = addTime(new Date(), { days: 1 });
            date.setHours(0, 0, 0);
            date = toNativeTime(date);
            this.props.datetimeInput.value = date.substr(0, date.lastIndexOf(':'));
            this.props.datetimeInput.addEventListener('change', (ev) => this.onDateTimeChange(ev));
            this.props.toggleSwitch.addEventListener('change', (ev) => this.reminderSet(ev));
            this.props.soundInput.addEventListener('input', (_ev) => this.dispatchEvent(new Event('input')));
            this.addEventListener('show-reminder', (ev) => this.onShowReminder(ev));
        }

        deleteClick(_ev) {
            const host = this.hostComponent();
            this.remove();
            host.dispatchEvent(new CustomEvent('child-removed'));
        }

        onDateTimeChange(_ev) {
            if (!this.props.toggleSwitch.checked) {
                return;
            }
            this.setTimer();
        }

        reminderSet(ev) {
            if (ev.target.checked) {
                this.setTimer();
            }
            else {
                timerAPI.removeTimer(this.refId);
            }
        }

        onShowReminder(_ev) {
            const now = new Date();
            const reminderTime = this.getDate()
            if (getFullDate(now) == getFullDate(reminderTime)) {
                const notification = new Notification(this.props.titleInput.value ? this.props.titleInput.value : 'Reminder', 
                { body: this.props.bodyInput.value ? this.props.bodyInput.value : toNativeTime(new Date()) });
                if (this.props.soundInput.value && !document.hasFocus()) {
                    audioAPI.playAudio(this, this.props.soundInput.value);
                    const focusInterval = setInterval(() => {
                        if (document.hasFocus()) {
                            audioAPI.pauseAudio(this);
                            clearInterval(focusInterval);
                        }
                    }, 1);
                    notification.addEventListener('click', () =>{
                        audioAPI.pauseAudio(this);
                        clearInterval(focusInterval);
                    });
                }
                if (this.props.repeatInput.value) {
                    let next = this.getRepeat();
                    next.setSeconds(0);
                    next = toNativeTime(next);
                    this.props.datetimeInput.value = `${next.substr(0, next.lastIndexOf(':'))}`;
                    this.dispatchEvent(new Event('input'));
                    this.setTimer();
                }
                else {
                    this.props.toggleSwitch.checked = false;
                    this.dispatchEvent(new Event('input'));
                }
            }
        }

        getState() {
            return {
                datetimeInput: this.getDate().getTime(),
                toggleSwitch: this.props.toggleSwitch.checked,
                soundInput: this.props.soundInput.value,
                repeatInput: this.props.repeatInput.valueAsNumber,
                repeatTypeInput: this.props.repeatTypeInput.value,
                titleInput: this.props.titleInput.value,
                bodyInput: this.props.bodyInput.value
            }
        }

        setState(state) {
            let date = new Date(state.datetimeInput);
            date = toNativeTime(date);
            this.props.datetimeInput.value = `${date.substr(0, date.lastIndexOf(':'))}`;
            this.props.toggleSwitch.onShadowRootReady(() => {
                this.props.toggleSwitch.checked = state.toggleSwitch;
            });
            this.props.soundInput.onShadowRootReady(() => {
                this.props.soundInput.value = state.soundInput;
                this.initSoundInput();
            });
            this.props.repeatInput.value = state.repeatInput;
            this.props.repeatTypeInput.value = state.repeatTypeInput;
            this.props.titleInput.value = state.titleInput;
            this.props.bodyInput.value = state.bodyInput;
            if (state.toggleSwitch) {
                this.setTimer();
            }
        }

        getDate() {
            const time = this.props.datetimeInput.value;
            const date = new Date(time);
            date.setSeconds(0);
            
            return date;
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

        getRepeat() {
            let now = new Date();
            const repeatValue = this.props.repeatInput.valueAsNumber;
            const repeat = {};
            repeat[this.props.repeatTypeInput.value] = repeatValue
            return addTime(now, repeat);
        }

        initSoundInput() {
            const extensions = ['wav', 'mp3', 'mp4', 'aac', 'ogg', 'webm', 'caf', 'flac'];
            this.props.soundInput.setOptions({filters: [{name: 'Audio Files', extensions: extensions}, {name: 'All Files', extensions: ['*']}]});
        }
    }

    customElements.define('reminder-component', Reminder);
})();