(() => {
    class TimerPage extends WebComponent {
        constructor() {
            super('components/TimerPage/TimerPage.html', 'timer-page');
        }
        
        async connectedCallback() {
            await super.connectedCallback();
            this.setRefId(this.genURefId());
            this.props = {
                hoursInput: this.shadowRoot.querySelector('#hours'),
                minutesInput: this.shadowRoot.querySelector('#minutes'),
                secondsInput: this.shadowRoot.querySelector('#seconds')
            }
            this.props.hoursInput.addEventListener('focus', ev => this.onFocus(ev));
            this.props.minutesInput.addEventListener('focus', ev => this.onFocus(ev));
            this.props.secondsInput.addEventListener('focus', ev => this.onFocus(ev));
            this.props.hoursInput.addEventListener('beforeinput', (ev) => this.onInput(ev));
            this.props.minutesInput.addEventListener('beforeinput', (ev) => this.onInput(ev));
            this.props.secondsInput.addEventListener('beforeinput', (ev) => this.onInput(ev));
            this.shadowRoot.querySelector('#timer-button').addEventListener('click', (ev) => this.onTimerButtonClick(ev));
        }

        onInput(ev) {
            if (ev.inputType == 'deleteContentBackward') {
                ev.target.value = ev.target.value.replace(/(?!0)/, '0');
            }
            else if (!isNaN(ev.target.value) && !isNaN(parseFloat(ev.target.value))) {
                if (ev.target.focused) {
                    ev.target.value = `0${ev.data}`;
                    delete ev.target.focused;
                }
                else {
                    const nextVal = `${ev.target.value[1]}${ev.data}`;
                    if (nextVal > ev.target.max) {
                        ev.target.value = ev.target.max;
                    }
                    else {
                        ev.target.value = `${ev.target.value[1]}${ev.data}`;
                    }
                    const props = [this.props.hoursInput, this.props.minutesInput, this.props.secondsInput];
                    const current = props.indexOf(ev.target);
                    if (current + 1 < props.length) {
                        props[current + 1].focus();
                    }
                }
                
            }
            ev.preventDefault();
        }

        onFocus(ev) {
            ev.target.focused = true;
        }

        onTimerButtonClick(ev) {
            const symbol = this.shadowRoot.querySelector('.play, .stop');
            for (const prop of Object.values(this.props)) {
                prop.toggleAttribute('disabled');
            }
            symbol.classList.toggle('play');
            symbol.classList.toggle('stop');
            if (symbol.classList.contains('stop')) {
                const hours = this.props.hoursInput.valueAsNumber;
                const minutes = this.props.minutesInput.valueAsNumber;
                const seconds = this.props.secondsInput.valueAsNumber;
                const timeout = new Date();
                const start = {hours: timeout.getHours(), minutes: timeout.getMinutes(), seconds: timeout.getSeconds()};
                timeout.setHours(start.hours + hours, start.minutes + minutes, start.seconds + seconds);
                const message = {
                    time: timeout,
                    page: this,
                    refId: this.refId
                }
                timerAPI.addTimer(message);
                this.timerInterval = setInterval(() => {
                    const now = new Date();
                    this.props.secondsInput.value = `${this.normalizeTime(now.getSeconds(), 
                        timeout.getSeconds(), parseInt(this.props.secondsInput.max) + 1)}`.padStart(2, '0');
                    this.props.minutesInput.value = `${this.normalizeTime(now.getMinutes(), 
                        timeout.getMinutes(), parseInt(this.props.minutesInput.max) + 1)}`.padStart(2, '0');
                    this.props.hoursInput.value = `${this.normalizeTime(now.getHours(), 
                        timeout.getHours(), parseInt(this.props.hoursInput.max) + 1)}`.padStart(2, '0');

                    if (this.props.secondsInput.value == 0 && this.props.minutesInput.value == 0 && this.props.hoursInput.value == 0) {
                        clearInterval(this.timerInterval);
                    }
                }, 1000);
            }
            else {
                clearInterval(this.timerInterval);
                timerAPI.removeTimer(this.refId);
            }
        }

        normalizeTime(start, end, max) {
            const timeDiff = end - start;
            return timeDiff >= 0 ? timeDiff : max + timeDiff;
        }
    }

    customElements.define('timer-page', TimerPage);
})();