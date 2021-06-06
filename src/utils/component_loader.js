async function load_component(path, name, templateID, extendsTarget=HTMLElement) {
    const parser = new DOMParser();
    const htmlFile = await (await fetch(path)).text();
    const vPage = parser.parseFromString(htmlFile, 'text/html');

    customElements.define(name, class extends extendsTarget {
        constructor() {
            super();
            const template = vPage.getElementById(templateID);
            const templateContent = template.content;
            const styles = vPage.querySelectorAll('link');
    
            const shadowRoot = this.attachShadow({mode: 'open'});
            for (const style of styles) {
                shadowRoot.appendChild(style.cloneNode(false));
            }
            shadowRoot.appendChild(templateContent.cloneNode(true));
        }
    });
}