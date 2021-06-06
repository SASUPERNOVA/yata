let AddButton = {};

(() => {
    loadComponent('components/AddButton/AddButton.html', 'add-button');

    const click = () => {
        console.log('OK');
        alert('Added!!!');
    }

    AddButton = {click};
})();