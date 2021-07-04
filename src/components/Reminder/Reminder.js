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
            this.props.datetimeInput.addEventListener('change', (ev) => this.onDateTimeChange(ev));
            this.props.toggleSwitch.addEventListener('change', ev => this.reminderSet(ev));
            this.props.soundInput.addEventListener('input', ev => this.dispatchEvent(new Event('input')));
            this.addEventListener('show-reminder', async (ev) => this.onShowReminder(ev));
        }

        deleteClick(ev) {
            //const host = this.hostComponent();
            this.remove();
            //host.dispatchEvent(new CustomEvent('child-removed'));
        }

        onDateTimeChange(ev) {

        }

        reminderSet(ev) {

        }

        onShowReminder(ev) {

        }

        setState() {

        }

        getState() {

        }

        getDate() {
            const time = this.props.datetimeInput.value;
            const date = new Date(time);
            date.setSeconds(0);
            
            return date;
        }
    }

    customElements.define('reminder-component', Reminder);
})();