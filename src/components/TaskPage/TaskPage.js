(() => {
    class TaskPage extends WebComponent {
        constructor() {
            super('components/TaskPage/TaskPage.html', 'task-page');
        }
        
        async connectedCallback() {
            await super.connectedCallback();
            this.shadowRoot.querySelector('add-button').addEventListener('addbutton-click', (ev) => this.onAddButtonClick(ev));
            this.addEventListener('timer-finished', ev => this.onTimerFinished(ev));
            this.addEventListener('child-removed', _ev => this.saveTasks());
            const file = await fsAPI.loadFile('TaskPage.json');
            if (file) {
                this.initialize(file.data);
            }
        }

        initialize(data) {
            for (const item of data) {
                const taskComponent = document.createElement('task-component');
                this.shadowRoot.querySelector('main').appendChild(taskComponent);
                taskComponent.onShadowRootReady(() => {
                    taskComponent.setState(item);
                });
                taskComponent.addEventListener('input', ev => this.onChildInput(ev));
            }
        }

        onAddButtonClick(ev) {
            const taskComponent = document.createElement('task-component');
            this.shadowRoot.querySelector('main').appendChild(taskComponent);
            taskComponent.addEventListener('input', ev => this.onChildInput(ev));
            taskComponent.onShadowRootReady(() => this.saveTasks());
        }

        onTimerFinished(ev) {
            this.shadowRoot.querySelector(`task-component[ref-id="${ev.detail}"]`).dispatchEvent(new CustomEvent('run-task'));
        }

        saveTasks() {
            const children = Array.from(this.shadowRoot.querySelector('main').children);
            fsAPI.saveFile('TaskPage.json', {data: Array.from(children).map(task => task.getState())});
        }
    }

    customElements.define('task-page', TaskPage);
})();