(() => {
    class ToggleSwitch extends WebComponent {
        constructor() {
            super('components/ToggleSwitch/ToggleSwitch.html', 'toggle-switch');
        }

        async connectedCallback() {
            await super.connectedCallback();
            this.shadowRoot.querySelector('#checkbox').addEventListener('change', (ev) => this.change(ev));
        }

        change(ev) {
            const checked = ev.target.checked;
            super.hostComponent().dispatchEvent(new CustomEvent('toggleswitch-toogle', {detail: {checked: checked}}));
        }
    }

    customElements.define('toggle-switch', ToggleSwitch);
})();