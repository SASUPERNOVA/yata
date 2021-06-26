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
            this.addEventListener('ring-alarm', ev => this.onRingAlarm(ev));
        }

        onRingAlarm(ev) {
            const timeDiff = new Date().getTime() - this.getDate().getTime();
            if (timeDiff < 60000) {
                new Notification('Alarm', { body: 'Be alarmed!!!' });
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
                this.props.toggleSwitch.setChecked(state.toggleSwitch);
            });
            this.props.soundInput.onShadowRootReady(() => {
                this.props.soundInput.value = state.soundInput;
                this.props.soundInput.setAccept('audio/*');
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
                new Notification('Alarm', { body: 'An alarm has been set...' });
                this.setTimer();
            }
            else {
                new Notification('Alarm', { body: 'An alarm has been disabled...' });
            }
        }

        deleteClick(ev) {
            this.remove();
        }

        setTimer() {
            let date = this.getDate();
            const message = {
                time: date.getTime(),
                page: this.hostComponent(),
                refId: this.getAttribute('ref-id')
            }
            document.dispatchEvent(new CustomEvent('set-timer', {detail: message}));
        }

        getDate() {
            const time = this.props.timeInput.value.split(':');
            const date = new Date();
            date.setHours(time[0]);
            date.setMinutes(time[1]);
            date.setSeconds(0);
            
            return date;
        }
    }

    customElements.define('alarm-component', Alarm);
})();