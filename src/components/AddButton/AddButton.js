(() => {
    loadComponent('components/AddButton/AddButton.html', 'add-button', eventListeners);

    function eventListeners() {
        const root = this.shadowRoot;

        root.querySelector('#add').addEventListener('click', click);
    }

    function click(ev) {
        hostComponent(hostComponent(ev.target)).dispatchEvent(new CustomEvent('addbutton-click'));
    }
})();