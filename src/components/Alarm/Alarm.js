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
        }

        getState() {
            return {
                timeInput: this.props.timeInput.value,
                toggleSwitch: this.props.toggleSwitch.value,
                soundInput: this.props.soundInput.value,
                titleInput: this.props.titleInput.value,
                bodyInput: this.props.bodyInput.value
            }
        }

        setState(state) {
            const date = new Date(parseInt(state.timeInput));
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
        }

        onTimeChange(ev) {
            if (!this.props.toggleSwitch.getAttribute('checked')) {
                return;
            }
            let time = ev.target.value.split(':');
            let date = new Date();
            date.setHours(time[0]);
            date.setMinutes(time[1]);
            const message = {
                time: date.getTime(),
                page: this.hostComponent(),
                refId: this.getAttribute('ref-id')
            }
            document.dispatchEvent(new CustomEvent('set-timer', {detail: message}));
        }

        alarmSet(ev) {
            if (ev.target.checked) {
                new Notification('Alarm', { body: 'An alarm has been set...' });
                const message = {
                    time: date.getTime(),
                    page: this.hostComponent(),
                    refId: this.getAttribute('ref-id')
                }
                document.dispatchEvent(new CustomEvent('set-timer', {detail: message}));
            }
            else {
                new Notification('Alarm', { body: 'An alarm has been disabled...' });
            }
        }

        deleteClick(ev) {
            this.remove();
        }
    }

    customElements.define('alarm-component', Alarm);
})();