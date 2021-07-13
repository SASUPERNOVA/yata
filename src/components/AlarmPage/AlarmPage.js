(() => {
    class AlarmPage extends WebComponent {
        constructor() {
            super('components/AlarmPage/AlarmPage.html', 'alarm-page');
        }

        async connectedCallback() {
            await super.connectedCallback();
            this.shadowRoot.querySelector('add-button').addEventListener('addbutton-click', (ev) => this.onAddButtonClick(ev));
            this.addEventListener('timer-finished', (ev) => this.onTimerFinished(ev));
            this.addEventListener('child-removed', (_ev) => this.saveAlarms());
            const file = await fsAPI.loadFile('AlarmPage.json');
            if (file) {
                this.initialize(file.data);
            }
        }

        onAddButtonClick(_ev) {
            const alarmComponent = document.createElement('alarm-component');
            this.shadowRoot.querySelector('main').appendChild(alarmComponent);
            alarmComponent.addEventListener('input', ev => this.onChildInput(ev));
            alarmComponent.onShadowRootReady(() => this.saveAlarms());
        }

        onTimerFinished(ev) {
            this.shadowRoot.querySelector(`alarm-component[ref-id="${ev.detail}"]`).dispatchEvent(new CustomEvent('ring-alarm'));
        }

        initialize(data) {
            for (const item of data) {
                const alarmComponent = document.createElement('alarm-component');
                this.shadowRoot.querySelector('main').appendChild(alarmComponent);
                alarmComponent.onShadowRootReady(() => {
                    alarmComponent.setState(item);
                });
                alarmComponent.addEventListener('input', ev => this.onChildInput(ev));
            }
        }

        onChildInput(_ev) {
            const save = () => {
                this.saveAlarms();
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

        saveAlarms() {
            const children = Array.from(this.shadowRoot.querySelector('main').children);
            fsAPI.saveFile('AlarmPage.json', {data: Array.from(children).map(alarm => alarm.getState())});
        }
    }

    customElements.define('alarm-page', AlarmPage);
})();