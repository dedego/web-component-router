# Simple Web Component Router

This is basic web component router that hooks into both the history API and the web components spec. You can use this to setup routing for your web components application. The router supports lazy loading for javascript modules (ESM).

To make sure the routing works as intended, please add a base tag to your root HTML page, like so:
```html
<base href="/">
```
The base href itself does not have to be `/`.

- [*class* Router](#router)
- [*class* RouteMixin](#routemixin)

---

## Router

The Router is a class mixin which you can use to extend your webcomponent. The following example will show you how to use it.

### Exampe with Lit Element

You can make use of [dynamic imports](https://v8.dev/features/dynamic-import) if your build tooling supports it. If not make sure the components have been (imported and) defined. The imported component will be passed a `routeProps` object containing (in this case) a property `type` and `day` for the page-stocks component. 

> As of version 1.2.0 the routes need to be defined as `static get routes()`.

**app.js**
```javascript
import { LitElement, html } from 'lit-element';
import { Router } from 'simple-wc-router';
import './pages/page_home';
import './components';

class App extends Router(LitElement) {
    static get routes() {
        return [
            {
                path: "/",
                component: "page-home"
            },
            {
                path: "/stock/:type/:day",
                component: "page-stocks",
                import: () => import("./src/page_stock.js")
            }
        ];
    }
    render404() {
        return html`<h2>404 The requested page could not be found</h2>`;
    }
    render() {
        return html`
            <app-header>
                <h1 slot="left">... some title goes here ...</h1>
                <nav slot="right">... some navigation goes here ...</nav>
            </app-header>
            <main>
                ${this.routeElement ? this.routeElement : this.render404()}
            </main>
            <app-footer>
                ... some copyright goes here ...
            </app-footer>
        `
    }
}
customElements.define('my-app', App);
```

**page_stocks.js**
```javascript
import { LitElement, html } from 'lit-element';

class Stocks extends LitElement {
    render() {
        // If provided, the properties for type and day are taking from the path.
        const { type = 'NASDAC', day = 'monday' } = this.routeProps;
        return html`This is the page for ${type} on a ${day}`
    }
}
customElements.define('page-stocks', Stocks);
```

---

## RouteMixin

The RouteMixin class should be used for those components that trigger navigation. The `navigate` method is added to the class, which only requires you to set a `route` property. The `navigate` method can also be called with a route. The mixin also provides you a boolean that tells you if the given route is active (`isRouteActive`) which you can utilize for e.g. styles.

```javascript
import { LitElement, html, css } from 'lit-element';
import { RouteMixin } from 'simple-wc-router'; 

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
        if (this.disabled) this.navigate('/button-was-disabled-why-did-you-click-it');
        this.navigate();
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

## Changelog

| Version | Changes                                                                          |
| ------- | -------------------------------------------------------------------------------- |
| 1.0.0   | Initial version of simple web component router                                   |
| 1.0.1   | Small bugfix                                                                     |
| 1.0.2   | Another small bugfix                                                             |
| 1.1.0   | Changed the routing setup                                                        |
| 2.0.0   | Changed route matching, routes must be defined as static. Also created example to play around.                          |

