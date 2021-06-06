(() => {
    loadComponent('components/AddButton/AddButton.html', 'add-button', eventListeners);

    function eventListeners() {
        const root = this.shadowRoot;

        root.querySelector('#add').addEventListener('click', click);
    }

    function click() {
        const alarm = document.createElement('alarm-component');
        document.querySelector('alarm-page').shadowRoot.querySelector('main').appendChild(alarm);
    }
})();