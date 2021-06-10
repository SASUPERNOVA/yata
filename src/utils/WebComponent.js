class WebComponent extends HTMLElement {
    constructor(path, name, templateID) {
        super();
        this.path = path;
        this.name = name;
        this.templateID = templateID || name;
    }

    async _loadTemplateFile(path, name, templateID) {
        templateID = templateID || name;
        const parser = new DOMParser();
        const htmlFile = await (await fetch(path)).text();
        const vPage = parser.parseFromString(htmlFile, 'text/html');
    
        const template = vPage.getElementById(templateID);
        const templateContent = template.content;
        const styles = vPage.querySelectorAll('link');
    
        return { templateContent, styles };
    }

    async _initComponent() {
        let { templateContent, styles } = await this._loadTemplateFile(this.path, this.name, this.templateID);
        const shadowRoot = this.attachShadow({ mode: 'open' });
        for (const style of styles) {
            shadowRoot.appendChild(style.cloneNode(false));
        }
        shadowRoot.appendChild(templateContent.cloneNode(true));
    }

    async connectedCallback() {
        await this._initComponent();
    }

    hostComponent() {
        return this.getRootNode().host;
    }
}