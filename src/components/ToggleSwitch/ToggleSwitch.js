(() => {
    class ToggleSwitch extends WebComponent {
        constructor() {
            super('components/ToggleSwitch/ToggleSwitch.html', 'toggle-switch');
        }

        async connectedCallback() {
            await super.connectedCallback();
            this.shadowRoot.querySelector('#checkbox').addEventListener('change', (ev) => this.change(ev));
            this.shadowRoot.querySelector('#checkbox').addEventListener('input', ev => this.input(ev));
            this.checked = false;
            this.setAttribute('checked', false);
        }

        setChecked(checked) {
            this.shadowRoot.querySelector('#checkbox').checked = checked == 'true';
            this.setAttribute('checked', checked);
        }

        change(ev) {
            this.checked = ev.target.checked;
            this.setAttribute('checked', this.checked);
            this.dispatchEvent(new Event('change'));
        }

        input(ev) {
            this.dispatchEvent(new Event('input'));
        }
    }

    customElements.define('toggle-switch', ToggleSwitch);
})();