(() => {
    loadComponent('components/Alarm/Alarm.html', 'alarm-component', eventListeners);

    function eventListeners() {
        const root = this.shadowRoot;

        root.querySelector('#delete-button').addEventListener('click', deleteClick);

        this.addEventListener('toggleswitch-toggle', alarmSet);
    }

    function alarmSet(ev) {
        if (ev.detail.checked) {
            new Notification('Alarm', {body: 'An alarm has been set...'});
        }
        else {
            new Notification('Alarm', {body: 'An alarm has been disabled...'});
        }
    }

    function deleteClick(ev) {
        parentComponent(ev.target).remove();
    }
})();