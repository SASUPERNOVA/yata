(() => {
    loadComponent('components/AddButton/AddButton.html', 'add-button', eventListeners);

    function eventListeners() {
        const root = this.shadowRoot;

        root.querySelector('#add').addEventListener('click', click);
    }

    function click() {
        alert('Added!!!');
    }
})();