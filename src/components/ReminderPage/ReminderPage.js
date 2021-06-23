(() => {
    class ReminderPage extends WebComponent {
        constructor() {
            super('components/ReminderPage/ReminderPage.html', 'reminder-page');
        }
    }

    customElements.define('reminder-page', ReminderPage);
})();