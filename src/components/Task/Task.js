(() => {
    class Task extends WebComponent {
        constructor() {
            super('components/Task/Task.html', 'task-component');
        }
        
        async connectedCallback() {
            await super.connectedCallback();
            this.setRefId(this.genURefId());
            this.shadowRoot.querySelector('#delete-button').addEventListener('click', (ev) => this.deleteClick(ev));
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
            this.props.timeInput.addEventListener('change', (ev) => this.onTimeChange(ev));
            this.props.runCommandRadio.addEventListener('click', (ev) => this.onRadioClick(ev));
            this.props.runFileRadio.addEventListener('click', (ev) => this.onRadioClick(ev));
            this.props.toggleSwitch.addEventListener('change', (ev) => this.taskSet(ev));
            this.addEventListener('run-task', (ev) => this.onRunTask(ev));
        }

        onTimeChange(_ev) {
            if (!this.props.toggleSwitch.checked) {
                return;
            }
            this.setTimer();
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
                refId: this.refId
            }
            timerAPI.addTimer(message);
        }

        getDate() {
            const time = this.props.timeInput.value.split(':');
            const date = dateFromTime({ hours: time[0], minutes: time[1]});
            
            return date;
        }

        onRunTask(_ev) {
            const timeDiff = new Date().getTime() - this.getDate().getTime();
            if (timeDiff < toMilliseconds(1, TimeType.MINUTE)) {
                if (this.props.runCommandRadio.checked) {
                    fsAPI.run(this.props.runCommandInput.value);
                }
                else {
                    fsAPI.run(this.props.runFileInput.value, this.props.argsInput.value);
                }
            }
        }

        getState() {
            return {
                timeInput: this.getDate().getTime(),
                toggleSwitch: this.props.toggleSwitch.checked,
                runCommandRadio: this.props.runCommandRadio.checked,
                runFileRadio: this.props.runFileRadio.checked,
                runCommandInput: this.props.runCommandInput.value,
                runFileInput: this.props.runFileInput.value,
                argsInput: this.props.argsInput.value
            }
        }

        setState(state) {
            const date = new Date(state.timeInput);
            const time = getFullTime(date);
            this.props.timeInput.value = `${time.slice(0, time.lastIndexOf(':'))}`;
            this.props.toggleSwitch.onShadowRootReady(() => {
                this.props.toggleSwitch.checked = state.toggleSwitch;
            });
            this.props.runCommandRadio.checked = state.runCommandRadio;
            this.props.runFileRadio.checked = state.runFileRadio;
            this.props.runCommandInput.value = state.runCommandInput;
            this.props.runFileInput.onShadowRootReady(() => {
                this.props.runFileInput.value = state.runFileInput;
            });
            this.props.argsInput.value = state.argsInput;
            if (this.props.runFileRadio.checked) {
                this.props.runCommandInput.classList.remove('active');
                this.props.runFile.classList.add('active');
            }
            if (state.toggleSwitch) {
                this.setTimer();
            }
        }

        deleteClick(_ev) {
            const host = this.hostComponent();
            this.remove();
            host.dispatchEvent(new CustomEvent('child-removed'));
        }
    }

    customElements.define('task-component', Task);
})();