(() => {
    class TimerPage extends WebComponent {
        constructor() {
            super('components/TimerPage/TimerPage.html', 'timer-page');
        }
        
        async connectedCallback() {
            await super.connectedCallback();
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
    }

    customElements.define('timer-page', TimerPage);
})();