(() => {
    class AlarmPage extends WebComponent {
        static alarms = {};
        static initialized = false;
        constructor() {
            super('components/AlarmPage/AlarmPage.html', 'alarm-page');
        }

        async connectedCallback() {
            await super.connectedCallback();
            this.addEventListener('addbutton-click', (ev) => this.onAddButtonClick(ev));
            this.addEventListener('timer-finished', ev => this.onTimerFinished(ev));
            this.addEventListener('data-received', ev => this.onDataReceived(ev));
            for (const alarm of Object.values(AlarmPage.alarms)) {
                this.shadowRoot.querySelector('main').appendChild(alarm.component);
            }
            if (!AlarmPage.initialized) {
                yanuAPI.loadFile('AlarmPage.json');
                AlarmPage.initialized = true;
            }
        }

        onAddButtonClick(ev) {
            const alarmComponent = document.createElement('alarm-component');
            //AlarmPage.alarms.push(alarmComponent);
            this.shadowRoot.querySelector('main').appendChild(alarmComponent);
            alarmComponent.onShadowRootReady(() => {
                AlarmPage.alarms[alarmComponent.refId] = {
                    component: alarmComponent,
                    state: alarmComponent.getState()
                };
            });
            alarmComponent.addEventListener('input', ev => this.onChildInput(ev));
        }

        onTimerFinished(ev) {
            console.log(ev.detail);
        }

        onDataReceived(ev) {
            const data = ev.detail.data;
            for (const item of data) {
                const alarmComponent = document.createElement('alarm-component');
                //AlarmPage.alarms.push(alarmComponent);
                this.shadowRoot.querySelector('main').appendChild(alarmComponent);
                alarmComponent.onShadowRootReady(() => {
                    alarmComponent.setState(item.alarm);
                    AlarmPage.alarms[alarmComponent.refId] = {
                        component: alarmComponent,
                        state: alarmComponent.getState()
                    };
                });
                alarmComponent.addEventListener('input', ev => this.onChildInput(ev));
            }
        }

        onChildInput(ev) {
            AlarmPage.alarms[ev.target.refId].state = ev.target.getState();
            console.log(AlarmPage.alarms);
        }
    }

    customElements.define('alarm-page', AlarmPage);
})();