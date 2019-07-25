# Web Component Router

This is basic web component router that hooks into both the history API and the web components spec.
You can use this to setup routing for your web components application. The router supports lazy loading
for javascript modules (ESM).

- [*class* Router](#Router)
- [*class* RouteMixin](#RouteMixin)

## Router

The Router is a class mixin which you can use to extend your webcomponent. The following example will show you how to use it:


### In Lit Element

You can make use of [dynamic imports](https://v8.dev/features/dynamic-import) if your build tooling supports it. Otherwise make sure the components have been (imported and) defined.

```javascript
import { LitElement, html } from 'lit-element';
import { Router } from 'wc-router';

class App extends Router(LitElement) {
    get routes() {
        return [
            {
                path: "/",
                component: "page-home",
                import: () => import("./src/page_home.js")
            },
            {
                path: "/stock/:type/:day",
                component: "page-stocks",
                import: () => import("./src/page_home.js")
            }
        ];
    }
    render() {
        return html`
            Route:
            ${this.routeElement}
        `
    }
}
customElements.define('my-app', App);
```

## RouteMixin

The RouteMixin class should be used for those components that trigger navigation. The `navigate` method is added to the class, which only requires you to set a `route` property. The mixin also provides you a boolean that tells you if the given route is active (`isRouteActive`) which you can utilize for e.g. styles.

```javascript
import { LitElement, html } from 'lit-element';
import { RouteMixin } from 'wc-router'; 

class Button extends RouteMixin(LitElement) {
    static get properties() {
        return {
           route: String,
           disabled: Boolean
        }
    }
    static get styles() {
        return css`
            :host > button.active {
                color: red;
            }
        `;
    }
    handleClick() {
        if (!this.disabled) this.navigate();
    }
    render() {
        const activeClass = this.isRouteActive ? 'active' : '';
        const clickHandler = this.handleClick.bind(this);
        return html`
            <button class="${activeClass}" @click="${clickHandler}">
                <slot></slot>
            </button>
        `;
    }    
}
customElements.define('w-button', Button);
```

Now when you want to use the component, it is as simple as:

```html
<w-button route="/foo/bar">The only bar in town... FooBar</w-button>
```