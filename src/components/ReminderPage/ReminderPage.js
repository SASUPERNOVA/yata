(() => {
    class ReminderPage extends WebComponent {
        constructor() {
            super('components/ReminderPage/ReminderPage.html', 'reminder-page');
        }
        
        async connectedCallback() {
            await super.connectedCallback();
            this.shadowRoot.querySelector('add-button').addEventListener('addbutton-click', (ev) => this.onAddButtonClick(ev));
        }

        async onAddButtonClick(ev) {
            const reminderComponent = document.createElement('reminder-component');
            this.shadowRoot.querySelector('main').appendChild(reminderComponent);
            reminderComponent.addEventListener('input', ev => this.onChildInput(ev));
            //reminderComponent.onShadowRootReady(() => this.saveAlarms());
            const file = await fsAPI.loadFile('ReminderPage.json');
            if (file) {
                this.initialize(file.data);
            }
        }

        initialize(data) {
            for (const item of data) {
                const reminderComponent = document.createElement('reminder-component');
                this.shadowRoot.querySelector('main').appendChild(reminderComponent);
                reminderComponent.onShadowRootReady(() => {
                    reminderComponent.setState(item);
                });
                reminderComponent.addEventListener('input', ev => this.onChildInput(ev));
            }
        }

        onChildInput(ev) {
            console.log('Child Input');
        }
    }

    customElements.define('reminder-page', ReminderPage);
})();