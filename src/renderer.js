(() => {
    const tabs = {
        alarms: "alarm-page",
        reminders: "reminder-page"
    }

    for (const [key, val] of Object.entries(tabs)) {
        const tab = document.getElementById(key);
        tab.addEventListener('click', () => {
            document.querySelector('header .active').classList.remove('active');
            tab.classList.add('active');
            const currentPage = document.createElement(val);
            document.getElementById('page-view').firstElementChild.replaceWith(currentPage);
        });
    }

    document.addEventListener('data-received', ev => {
        const data = ev.detail;
        document.querySelector('#page-view').firstElementChild.dispatchEvent(new CustomEvent('data-received', {detail: data}));
    });
})();