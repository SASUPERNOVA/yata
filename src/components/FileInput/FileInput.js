//Alarm Sound
(() => {
    class FileInput extends WebComponent {
        constructor() {
            super('components/FileInput/FileInput.html', 'file-input');
            this.value = '';
        }

        async connectedCallback() {
            await super.connectedCallback();
            this.shadowRoot.querySelector('#sound-input').addEventListener('change', ev => this.change(ev));
            this.shadowRoot.querySelector('#sound-input').addEventListener('input', ev => this.input(ev));
        }

        change(ev) {
            this.value = ev.target.value;
            this.dispatchEvent(new Event('change'));
        }

        input(ev) {
            this.dispatchEvent(new Event('input'));
        }

        setAccept(accept) {
            this.shadowRoot.querySelector('#sound-input').setAttribute('accept', accept);
        }
    }

    customElements.define('file-input', FileInput);
})();