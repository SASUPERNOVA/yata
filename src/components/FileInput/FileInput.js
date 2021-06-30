(() => {
    class FileInput extends WebComponent {
        constructor() {
            super('components/FileInput/FileInput.html', 'file-input');
            this.options = undefined;
        }

        async connectedCallback() {
            await super.connectedCallback();
            this.props = {
                fileBrowser: this.shadowRoot.querySelector('#file-browser'),
                fileDisplay: this.shadowRoot.querySelector('#file-display')
            }
            this.props.fileBrowser.addEventListener('click', async (ev) => this.onFileBrowserClick(ev));
        }

        async onFileBrowserClick(ev) {
            const files = await yanuAPI.openFileDialog(this.options);
            if (files) {
                this.value = files[0];
                this.props.fileDisplay.textContent = this.value;
                this.dispatchEvent(new Event('input'));
                this.dispatchEvent(new Event('change'));
            }
        }

        set value(value) {
            this.props.fileDisplay.textContent = value;
        }

        get value() {
            if (this.props) {
                return this.props.fileDisplay.textContent;
            }
            return '';
        }

        setOptions(options) {
            this.options = options;
        }
    }

    customElements.define('file-input', FileInput);
})();