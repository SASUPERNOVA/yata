(() => {
    class ReminderPage extends WebComponent {
        constructor() {
            super('components/ReminderPage/ReminderPage.html');
        }
        
        async connectedCallback() {
            await super.connectedCallback();
            this.shadowRoot.querySelector('add-button').addEventListener('addbutton-click', (ev) => this.onAddButtonClick(ev));
            this.addEventListener('timer-finished', (ev) => this.onTimerFinished(ev));
            this.addEventListener('child-removed', (_ev) => this.saveReminders());
            const file = await fsAPI.loadFile('ReminderPage.json');
            if (file) {
                this.initialize(file.data);
            }
        }

        onAddButtonClick(_ev) {
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

        onChildInput(_ev) {
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

        onTimerFinished(ev) {
            this.shadowRoot.querySelector(`reminder-component[ref-id="${ev.detail}"]`).dispatchEvent(new CustomEvent('show-reminder'));
        }
    }

    customElements.define('reminder-page', ReminderPage);
})();