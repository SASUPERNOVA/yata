//Alarm Sound
(() => {
    class FileInput extends WebComponent {
        constructor() {
            super('components/FileInput/FileInput.html', 'file-input');
            this.value = '';
        }

        async connectedCallback() {
            await super.connectedCallback();
            this.shadowRoot.querySelector('#sound-input').addEventListener('changed', ev => this.setValue(ev.target.value));
        }

        setValue(value) {
            this.value = value;
        }

        setAccept(accept) {
            this.shadowRoot.querySelector('#sound-input').setAttribute('accept', accept);
        }
    }

    customElements.define('file-input', FileInput);
})();