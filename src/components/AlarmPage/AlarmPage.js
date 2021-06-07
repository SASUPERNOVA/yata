(() => {
    loadComponent('components/AlarmPage/AlarmPage.html', 'alarm-page', eventListeners);

    function eventListeners() {
        this.addEventListener('addbutton-click', onAddButtonClick);
    }

    function onAddButtonClick(ev) {
        const root = ev.target.shadowRoot;

        const alarmComponent = document.createElement('alarm-component');
        
        root.querySelector('main').appendChild(alarmComponent);
    }
})();