let AddButton = {};

(() => {
    load_component('components/AddButton/AddButton.html', 'add-button', 'add-button', 'add-button-style');

    const click = () => {
        console.log('OK');
        alert('Added!!!');
    }

    AddButton = {click};
})();