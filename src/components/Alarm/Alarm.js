(() => {
    loadComponent('components/Alarm/Alarm.html', 'alarm-component', eventListeners);

    function eventListeners() {
        const root = this.shadowRoot;

        root.querySelector('#delete-button').addEventListener('click', deleteClick);
    }

    function deleteClick(ev) {
        ev.target.getRootNode().host.remove();
    }
})();