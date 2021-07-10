(() => {
    class TaskPage extends WebComponent {
        constructor() {
            super('components/TaskPage/TaskPage.html', 'task-page');
        }
        
        async connectedCallback() {
            await super.connectedCallback();
        }
    }

    customElements.define('task-page', TaskPage);
})();