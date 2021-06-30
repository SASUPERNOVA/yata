(() => {
    class AlarmPage extends WebComponent {
        static alarms = [];
        static initialized = false;
        constructor() {
            super('components/AlarmPage/AlarmPage.html', 'alarm-page');
        }

        async connectedCallback() {
            await super.connectedCallback();
            this.shadowRoot.querySelector('add-button').addEventListener('addbutton-click', (ev) => this.onAddButtonClick(ev));
            this.addEventListener('timer-finished', ev => this.onTimerFinished(ev));
            this.addEventListener('data-received', ev => this.onDataReceived(ev));
            this.addEventListener('child-removed', _ev => this.saveAlarms());
            for (const alarm of AlarmPage.alarms) {
                this.shadowRoot.querySelector('main').appendChild(alarm);
            }
            if (!AlarmPage.initialized) {
                fsAPI.loadFile('AlarmPage.json');
                AlarmPage.initialized = true;
            }
        }

        onAddButtonClick(ev) {
            const alarmComponent = document.createElement('alarm-component');
            AlarmPage.alarms.push(alarmComponent);
            this.shadowRoot.querySelector('main').appendChild(alarmComponent);
            alarmComponent.addEventListener('input', ev => this.onChildInput(ev));
            alarmComponent.onShadowRootReady(() => this.saveAlarms());
        }

        onTimerFinished(ev) {
            this.shadowRoot.querySelector(`alarm-component[ref-id="${ev.detail}"]`).dispatchEvent(new CustomEvent('ring-alarm'));
        }

        onDataReceived(ev) {
            const data = ev.detail.data;
            for (const item of data) {
                const alarmComponent = document.createElement('alarm-component');
                AlarmPage.alarms.push(alarmComponent);
                this.shadowRoot.querySelector('main').appendChild(alarmComponent);
                alarmComponent.onShadowRootReady(() => {
                    alarmComponent.setState(item);
                });
                alarmComponent.addEventListener('input', ev => this.onChildInput(ev));
            }
        }

        onChildInput(ev) {
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