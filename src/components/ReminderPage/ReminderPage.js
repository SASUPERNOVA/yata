(() => {
    class ReminderPage extends WebComponent {
        constructor() {
            super('components/ReminderPage/ReminderPage.html', 'reminder-page');
        }
        
        async connectedCallback() {
            await super.connectedCallback();
            this.shadowRoot.querySelector('add-button').addEventListener('addbutton-click', (ev) => this.onAddButtonClick(ev));
        }

        onAddButtonClick(ev) {
            const reminderComponent = document.createElement('reminder-component');
            this.shadowRoot.querySelector('main').appendChild(reminderComponent);
            //reminderComponent.addEventListener('input', ev => this.onChildInput(ev));
            //reminderComponent.onShadowRootReady(() => this.saveAlarms());
        }
    }

    customElements.define('reminder-page', ReminderPage);
})();