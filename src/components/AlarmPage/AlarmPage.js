(() => {
    class AlarmPage extends WebComponent {
        static alarms = [];
        static initialized = false;
        constructor() {
            super('components/AlarmPage/AlarmPage.html', 'alarm-page');
        }

        async connectedCallback() {
            await super.connectedCallback();
            this.addEventListener('addbutton-click', (ev) => this.onAddButtonClick(ev));
            this.addEventListener('timer-finished', ev => this.onTimerFinished(ev));
            this.addEventListener('data-received', ev => this.onDataReceived(ev));
            for (const alarm of AlarmPage.alarms) {
                this.shadowRoot.querySelector('main').appendChild(alarm);
            }
            if (!AlarmPage.initialized) {
                yanuAPI.loadFile('AlarmPage.json');
                AlarmPage.initialized = true;
            }
        }

        onAddButtonClick(ev) {
            const alarmComponent = document.createElement('alarm-component');
            AlarmPage.alarms.push(alarmComponent); 
            this.shadowRoot.querySelector('main').appendChild(alarmComponent);
        }

        onTimerFinished(ev) {
            console.log(ev.detail);
        }

        onDataReceived(ev) {
            const data = ev.detail.data;
            for (const item of data) {
                const alarmComponent = document.createElement('alarm-component');
                AlarmPage.alarms.push(alarmComponent);
                this.shadowRoot.querySelector('main').appendChild(alarmComponent);
                alarmComponent.onShadowRootReady(() => {
                    alarmComponent.setState(item.alarm);
                });
            }
        }
    }

    customElements.define('alarm-page', AlarmPage);
    document.dispatchEvent(new CustomEvent('register-page', {detail: {componentName: 'alarm-page', className: AlarmPage}}));
})();