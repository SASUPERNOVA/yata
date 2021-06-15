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

    genURefId() {
        /*! https://gist.github.com/jed/982883 */
        return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
            (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
          );
    }

    setRefId(refId) {
        if (!this.hasAttribute('ref-id')) {
            this.setAttribute('ref-id', refId);
        }
    }
}