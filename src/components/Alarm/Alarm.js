(() => {
    loadComponent('components/Alarm/Alarm.html', 'alarm-component', eventListeners);

    function eventListeners() {
        const root = this.shadowRoot;

        //root.querySelector('#add').addEventListener('click', click);
    }
})();