(() => {
    loadComponent('components/AddButton/AddButton.html', 'add-button', eventListeners);

    const pages = {
        'alarm-page': 'alarm-component',
        'reminder-page': 'reminder-component'
    };

    function eventListeners() {
        const root = this.shadowRoot;

        root.querySelector('#add').addEventListener('click', click);
    }

    function click() {
        const currentPage = document.getElementById('page-view').children[0].tagName.toLowerCase();
        const childComponent = document.createElement(pages[currentPage]);
        document.querySelector(currentPage).shadowRoot.querySelector('main').appendChild(childComponent);
    }
})();