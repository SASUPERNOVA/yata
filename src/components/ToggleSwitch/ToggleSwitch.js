(() => {
    loadComponent('components/ToggleSwitch/ToggleSwitch.html', 'toggle-switch', eventListeners);

    function eventListeners() {
        const root = this.shadowRoot;

        root.querySelector('#checkbox').addEventListener('change', change);
    }
    
    function change(ev) {
        const checked = ev.target.checked;
        hostComponent(hostComponent(ev.target)).dispatchEvent(new CustomEvent('toggleswitch-toggle', {detail: { checked: checked }}));
    }
})();