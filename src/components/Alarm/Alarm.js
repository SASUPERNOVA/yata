(() => {
    class Alarm extends WebComponent {
        constructor() {
            super('components/Alarm/Alarm.html', 'alarm-component');
        }

        async connectedCallback() {
            await super.connectedCallback();
            this.shadowRoot.querySelector('#delete-button').addEventListener('click', (ev) => this.deleteClick(ev));
            this.addEventListener('toggleswitch-toggle', (ev) => this.alarmSet(ev));
        }

        alarmSet(ev) {
            if (ev.detail.checked) {
                new Notification('Alarm', { body: 'An alarm has been set...' });
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