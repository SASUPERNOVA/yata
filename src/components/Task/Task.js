(() => {
    class Task extends WebComponent {
        constructor() {
            super('components/Task/Task.html', 'task-component');
        }
        
        async connectedCallback() {
            await super.connectedCallback();
        }
    }

    customElements.define('task-component', Task);
})();