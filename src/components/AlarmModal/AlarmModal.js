(() => {
    class AlarmModal extends WebComponent {
        constructor() {
            super('components/AlarmModal/AlarmModal.html', 'alarm-modal');
        }

        async connectedCallback() {
            await super.connectedCallback();
            this.shadowRoot.querySelector('#dismiss-button').addEventListener('click', (_ev) => this.dispatchEvent(new Event('close')));
        }
    }

    customElements.define('alarm-modal', AlarmModal);
})();