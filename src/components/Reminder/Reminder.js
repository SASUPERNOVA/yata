(() => {
    class Reminder extends WebComponent {
        constructor() {
            super('components/Reminder/Reminder.html', 'reminder-component');
        }

        async connectedCallback() {
            await super.connectedCallback();
        }
    }

    customElements.define('reminder-component', Reminder);
})();