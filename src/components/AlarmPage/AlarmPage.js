(() => {
    class AlarmPage extends WebComponent {
        constructor() {
            super('components/AlarmPage/AlarmPage.html', 'alarm-page');
        }

        async connectedCallback() {
            await super.connectedCallback();
            this.addEventListener('addbutton-click', (ev) => this.onAddButtonClick(ev));
            this.addEventListener('timer-finished', ev => this.onTimerFinished(ev));
        }

        onAddButtonClick(ev) {
            const alarmComponent = document.createElement('alarm-component');
            this.shadowRoot.querySelector('main').appendChild(alarmComponent); 
        }

        onTimerFinished(ev) {
            console.log(ev.detail);
        }
    }

    customElements.define('alarm-page', AlarmPage);
    document.dispatchEvent(new CustomEvent('register-page', {detail: {componentName: 'alarm-page', className: AlarmPage}}));
})();