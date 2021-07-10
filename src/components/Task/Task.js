(() => {
    class Task extends WebComponent {
        constructor() {
            super('components/Task/Task.html', 'task-component');
        }
        
        async connectedCallback() {
            await super.connectedCallback();
            this.setRefId(this.genURefId());
            this.props = {
                timeInput: this.shadowRoot.querySelector('#time-input'),
                toggleSwitch: this.shadowRoot.querySelector('toggle-switch'),
                runCommandRadio: this.shadowRoot.querySelector('#run-command-radio'),
                runFileRadio: this.shadowRoot.querySelector('#run-file-radio'),
                runCommandInput: this.shadowRoot.querySelector('#run-command-input'),
                runFile: this.shadowRoot.querySelector('#run-file'),
                runFileInput: this.shadowRoot.querySelector('#run-file-input'),
                argsInput: this.shadowRoot.querySelector('#args-input')
            }
            this.props.runCommandRadio.addEventListener('click', (ev) => this.onRadioClick(ev));
            this.props.runFileRadio.addEventListener('click', (ev) => this.onRadioClick(ev));
            this.props.toggleSwitch.addEventListener('change', ev => this.taskSet(ev));
        }

        onRadioClick(ev) {
            if (ev.target == this.props.runCommandRadio) {
                this.props.runCommandInput.classList.add('active');
                this.props.runFile.classList.remove('active');
            }
            else {
                this.props.runCommandInput.classList.remove('active');
                this.props.runFile.classList.add('active');
            }
        }

        taskSet(ev) {
            if (ev.target.checked) {
                this.setTimer();
            }
            else {
                timerAPI.removeTimer(this.refId);
            }
        }

        setTimer() {
            let date = this.getDate();
            const message = {
                time: date.getTime(),
                page: this.hostComponent(),
                refId: this.getAttribute('ref-id')
            }
            timerAPI.addTimer(message);
        }

        getDate() {
            const time = this.props.timeInput.value.split(':');
            const date = dateFromTime({ hours: time[0], minutes: time[1]});
            
            return date;
        }
    }

    customElements.define('task-component', Task);
})();