(() => {
    class Modal extends WebComponent {
        constructor() {
            super('components/Modal/Modal.html', 'modal-component');
        }
    }

    customElements.define('modal-component', Modal);
})();