import { LitElement, html } from 'lit-element';
import { Router } from './src';

class A extends LitElement {
    render() { return html`<a href="/b">A</a>` }
}
customElements.define('web-a', A);
class B extends LitElement {
    render() { return html`<a href="/">B</a>` }
}
customElements.define('web-b', B);

class WebApp extends Router(LitElement) {
    static get routes() {
        return [
            { path: '/', component: 'web-a' },
            { path: '/b', component: 'web-b' }
        ]
    }
    render() {
        return html`
            <h1>Web App</h1>
            ${this.routeElement}
        `
    }
}
customElements.define('web-app', WebApp)