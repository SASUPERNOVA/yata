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
                secondsInput: this.shadowRoot.querySelector('#seconds'),
                soundInput: this.shadowRoot.querySelector('#sound-input')
            }
            this.props.soundInput.onShadowRootReady(() => {
                this.initSoundInput();
            });
            this.props.hoursInput.addEventListener('focus', ev => this.onFocus(ev));
            this.props.minutesInput.addEventListener('focus', ev => this.onFocus(ev));
            this.props.secondsInput.addEventListener('focus', ev => this.onFocus(ev));
            this.props.hoursInput.addEventListener('beforeinput', (ev) => this.onInput(ev));
            this.props.minutesInput.addEventListener('beforeinput', (ev) => this.onInput(ev));
            this.props.secondsInput.addEventListener('beforeinput', (ev) => this.onInput(ev));
            this.shadowRoot.querySelector('#timer-button').addEventListener('click', (ev) => this.onTimerButtonClick(ev));
            this.addEventListener('timer-finished', (ev) => this.onTimerFinished(ev));
        }

        onInput(ev) {
            if (ev.inputType == 'deleteContentBackward') {
                ev.target.value = ev.target.value.replace(/(?!0)/, '0');
            }
            else if (!isNaN(ev.data) && !isNaN(parseFloat(ev.data))) {
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
            const symbol = this.shadowRoot.querySelector('span');
            this.toggleInputs();
            this.toggleTimerButton();
            if (symbol.classList.contains('stop')) {
                const hours = this.props.hoursInput.valueAsNumber;
                const minutes = this.props.minutesInput.valueAsNumber;
                const seconds = this.props.secondsInput.valueAsNumber;
                const timeout = addTime(new Date(), { hours, minutes, seconds });
                const message = {
                    time: timeout,
                    page: this,
                    refId: this.refId
                }
                timerAPI.addTimer(message);
                this.timerInterval = setInterval(() => {
                    if (this.props.secondsInput.value == 0 && this.props.minutesInput.value == 0 && this.props.hoursInput.value == 0) {
                        clearInterval(this.timerInterval);
                        return;
                    }
                    const now = new Date();
                    const diff = subtractTime(timeout, {hours: now.getHours(), minutes: now.getMinutes(), seconds: now.getSeconds()});
                    this.props.secondsInput.value = `${padNum(diff.getSeconds())}`;
                    this.props.minutesInput.value = `${padNum(diff.getMinutes())}`;
                    this.props.hoursInput.value = `${padNum(diff.getHours())}`;
                }, 1000);
            }
            else {
                clearInterval(this.timerInterval);
                delete this.timerInterval;
                timerAPI.removeTimer(this.refId);
            }
        }

        toggleInputs() {
            const time = [this.props.hoursInput, this.props.minutesInput, this.props.secondsInput];
            for (const unit of time) {
                unit.toggleAttribute('disabled');
            }
        }

        toggleTimerButton() {
            const symbol = this.shadowRoot.querySelector('span');
            symbol.classList.toggle('play');
            symbol.classList.toggle('stop');
        }

        onTimerFinished(ev) {
            timerAPI.pauseClock();
            const notification = new Notification('Timer Finished!');
            this.toggleBlink();
            const audio = new Audio(this.props.soundInput.value);
            audio.loop = true;
            audio.play();
            const onStopClicked = () => {
                this.toggleBlink();
                audio.pause();
                this.shadowRoot.querySelector('#timer-button').removeEventListener('click', onStopClicked);
                timerAPI.resumeClock();
            }
            this.shadowRoot.querySelector('#timer-button').addEventListener('click', onStopClicked);
            notification.addEventListener('click', onStopClicked);
        }

        initSoundInput() {
            const extensions = ['wav', 'mp3', 'mp4', 'aac', 'ogg', 'webm', 'caf', 'flac'];
            this.props.soundInput.setOptions({filters: [{name: 'Audio Files', extensions: extensions}, {name: 'All Files', extensions: ['*']}]});
            this.props.soundInput.value = 'media/alarm-sound.flac';
        }

        toggleBlink() {
            this.shadowRoot.querySelector("#timer").classList.toggle('blink');
        }
    }

    customElements.define('timer-page', TimerPage);
})();