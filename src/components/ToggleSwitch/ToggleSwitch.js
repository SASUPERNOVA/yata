(() => {
    class ToggleSwitch extends WebComponent {
        constructor() {
            super('components/ToggleSwitch/ToggleSwitch.html', 'toggle-switch');
        }

        async connectedCallback() {
            await super.connectedCallback();
            this.shadowRoot.querySelector('#checkbox').addEventListener('change', (ev) => this.change(ev));
            this.setAttribute('checked', false);
        }

        setChecked(checked) {
            this.shadowRoot.querySelector('#checkbox').checked = checked == 'true';
            this.setAttribute('checked', checked);
        }

        change(ev) {
            const checked = ev.target.checked;
            this.setAttribute('checked', checked);
            this.hostComponent().dispatchEvent(new CustomEvent('toggleswitch-toggle', {detail: {checked: checked}}));
        }
    }

    customElements.define('toggle-switch', ToggleSwitch);
})();