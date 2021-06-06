(() => {
    const tabs = {
        alarms: "alarm-page",
        reminders: "reminder-page"
    }

    for (const [key, val] of Object.entries(tabs)) {
        const tab = document.getElementById(key);
        console.log(tab);
        tab.addEventListener('click', () => {
            document.querySelector('header .active').classList.remove('active');
            tab.classList.add('active');
            const currentPage = document.createElement(val);
            document.getElementById('page-view').children[0].replaceWith(currentPage);
        });
    }
})();