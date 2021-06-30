(() => {
    class AddButton extends WebComponent {
        constructor() {
            super('components/AddButton/AddButton.html', 'add-button');
        }

        async connectedCallback() {
            await super.connectedCallback();
            this.shadowRoot.querySelector('#add-btn').addEventListener('click', (ev) => this.click(ev));
        }

        click(ev) {
            this.dispatchEvent(new CustomEvent('addbutton-click'));
        }
    }

    customElements.define('add-button', AddButton);
})();