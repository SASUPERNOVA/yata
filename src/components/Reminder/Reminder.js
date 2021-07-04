(() => {
    class Reminder extends WebComponent {
        constructor() {
            super('components/Reminder/Reminder.html', 'reminder-component');
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
            let date = new Date();
            date.setDate(date.getDate() + 1);
            date.setHours(0, 0, 0);
            date = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
            this.props.datetimeInput.value = date.toISOString().substr(0, date.toISOString().lastIndexOf(':'));
            this.props.datetimeInput.addEventListener('change', (ev) => this.onDateTimeChange(ev));
            this.props.toggleSwitch.addEventListener('change', ev => this.reminderSet(ev));
            this.props.soundInput.addEventListener('input', ev => this.dispatchEvent(new Event('input')));
            this.addEventListener('show-reminder', async (ev) => this.onShowReminder(ev));
        }

        deleteClick(ev) {
            const host = this.hostComponent();
            this.remove();
            host.dispatchEvent(new CustomEvent('child-removed'));
        }

        onDateTimeChange(ev) {
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

        onShowReminder(ev) {
            const now = new Date();
            const reminderTime = this.getDate()
            const timeDiff = now.getTime() - reminderTime.getTime();
            if (timeDiff < 86400000 && now.getDate() == reminderTime.getDate()) {
                if (this.props.titleInput.value || this.props.bodyInput.value) {
                    new Notification(this.props.titleInput.value, { body: this.props.bodyInput.value });
                }
                if (this.props.soundInput.value) {
                    const audio = new Audio(this.props.soundInput.value);
                    audio.play();
                    const focusInterval = setInterval(() => {
                        if (document.hasFocus()) {
                            clearInterval(focusInterval);
                        }
                    }, 1);
                }
                if (this.props.repeatInput.value) {
                    let next = new Date(this.getRepeat());
                    next.setSeconds(0);
                    next = new Date(next.getTime() - next.getTimezoneOffset() * 60000);
                    this.props.datetimeInput.value = `${next.toISOString().substr(0, next.toISOString().lastIndexOf(':'))}`;
                    this.dispatchEvent(new Event('input'));
                    timerAPI.pauseClock();
                    this.setTimer();
                    timerAPI.resumeClock();
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
            date = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
            this.props.datetimeInput.value = `${date.toISOString().substr(0, date.toISOString().lastIndexOf(':'))}`;
            this.props.toggleSwitch.onShadowRootReady(() => {
                this.props.toggleSwitch.checked = state.toggleSwitch;
            });
            this.props.soundInput.onShadowRootReady(() => {
                this.props.soundInput.value = state.soundInput;
                this.initSoundInput();
            });
            this.props.repeatInput.valueAsNumber = state.repeatInput;
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
                refId: this.getAttribute('ref-id')
            }
            timerAPI.addTimer(message);
        }

        getRepeat() {
            let now = new Date();
            const repeatValue = this.props.repeatInput.valueAsNumber;
            switch(this.props.repeatTypeInput.value) {
                case 'minutes':
                    console.log(now.getMinutes() + repeatValue);
                    now.setMinutes(now.getMinutes() + repeatValue);
                    break;
                case 'hours':
                    now.setHours(now.getHours() + repeatValue);
                    break;
                case 'days':
                    now.setDate(now.getDate() + repeatValue);
                    break;
                case 'weeks':
                    now.setDate(now.getDate() + repeatValue*7);
                    break;
                case 'months':
                    now.setMonth(now.getMonth() + repeatValue);
                    break;
                case 'years':
                    now.setFullYear(now.getFullYear() + repeatValue);
                    break;
                default:
                    return NaN;
            }
            return now.getTime();
        }

        initSoundInput() {
            const extensions = ['wav', 'mp3', 'mp4', 'aac', 'ogg', 'webm', 'caf', 'flac'];
            this.props.soundInput.setOptions({filters: [{name: 'Audio Files', extensions: extensions}, {name: 'All Files', extensions: ['*']}]});
        }
    }

    customElements.define('reminder-component', Reminder);
})();