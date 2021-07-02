(() => {
    const tabs = Array.from(document.querySelector('header').children);
    const pages = Array.from(document.querySelector('#page-view').children);
    const groups = tabs.map((tab, idx) => {
        return [tab.id, pages[idx].tagName];
    });

    for (const [key, val] of groups) {
        const tab = document.getElementById(key);
        const page = document.querySelector(val);
        tab.addEventListener('click', () => {
            document.querySelector('.active').classList.remove('active');
            tab.classList.add('active');
            document.querySelector('.active-page').classList.remove('active-page');
            page.classList.add('active-page');
        });
    }
})();