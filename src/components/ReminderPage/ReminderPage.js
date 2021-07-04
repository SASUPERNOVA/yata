(() => {
    class ReminderPage extends WebComponent {
        constructor() {
            super('components/ReminderPage/ReminderPage.html', 'reminder-page');
        }
        
        async connectedCallback() {
            await super.connectedCallback();
            this.shadowRoot.querySelector('add-button').addEventListener('addbutton-click', (ev) => this.onAddButtonClick(ev));
            this.addEventListener('child-removed', _ev => this.saveReminders());
            const file = await fsAPI.loadFile('ReminderPage.json');
            if (file) {
                this.initialize(file.data);
            }
        }

        async onAddButtonClick(ev) {
            const reminderComponent = document.createElement('reminder-component');
            this.shadowRoot.querySelector('main').appendChild(reminderComponent);
            reminderComponent.addEventListener('input', ev => this.onChildInput(ev));
            reminderComponent.onShadowRootReady(() => this.saveReminders());
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
            const save = () => {
                this.saveReminders();
                delete this.isTyping;
            }

            if (!this.isTyping) {
                this.isTyping = setTimeout(save, 2000);
            }
            else {
                clearTimeout(this.isTyping);
                this.isTyping = setTimeout(save, 2000);
            }
        }

        saveReminders() {
            const children = Array.from(this.shadowRoot.querySelector('main').children);
            fsAPI.saveFile('ReminderPage.json', {data: Array.from(children).map(reminder => reminder.getState())});
        }
    }

    customElements.define('reminder-page', ReminderPage);
})();