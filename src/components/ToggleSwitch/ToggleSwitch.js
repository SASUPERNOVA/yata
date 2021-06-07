(() => {
    loadComponent('components/ToggleSwitch/ToggleSwitch.html', 'toggle-switch', eventListeners);

    function eventListeners() {
        const root = this.shadowRoot;

        root.querySelector('#checkbox').addEventListener('change', checkboxChange);
    }
    
    function checkboxChange(ev) {
        const checked = ev.target.checked;
        parentComponent(parentComponent(ev.target)).dispatchEvent(new CustomEvent('toggleswitch-toggle', {detail: { checked: checked }}));
    }
})();