(() => {
    class ToggleSwitch extends WebComponent {
        constructor() {
            super('components/ToggleSwitch/ToggleSwitch.html', 'toggle-switch');
        }

        async connectedCallback() {
            await super.connectedCallback();
            this.shadowRoot.querySelector('#checkbox').addEventListener('change', (ev) => this.change(ev));
            this.shadowRoot.querySelector('#checkbox').addEventListener('input', (ev) => this.input(ev));
        }

        change(_ev) {
            this.dispatchEvent(new Event('change'));
        }

        input(_ev) {
            this.dispatchEvent(new Event('input'));
        }

        set checked(checked) {
            this.shadowRoot.querySelector('#checkbox').checked = checked;
        }

        get checked() {
            if (this.shadowRoot) {
                return this.shadowRoot.querySelector('#checkbox').checked;
            }
            return false;
        }
    }

    customElements.define('toggle-switch', ToggleSwitch);
})();