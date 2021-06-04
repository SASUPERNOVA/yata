let Dummy = {};

(() => {
    load_component('components/dummy/dummy.html', 'dummy-element', 'dummy-element', 'dummy-style');

    const dummyClick = () => {
        alert('External dummy alert!!!');
    };

    Dummy = {dummyClick};
})();