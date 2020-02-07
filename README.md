# Simple Web Component Router
![alt text](simple-wc-router.png "Simple <Web Component /> Router")

This is a *simple web component router* that hooks into both the history API and the web components API. You can use this to setup routing for your web components application.

**Features:**

- Dynamic imports (Lazy loading for javascript modules)
- Simple setup
- Flexibility using either the `render` method or a `component` name for rendering a route  

**Documentation:**
- [Getting Started](#getting-started)
- [Router](#router)
- [RouteMixin](#routemixin)

---

## Getting started

**Installation**
```javascript
npm install simple-wc-router --save
```

```javascript
yarn add simple-wc-router
```

**Usage**

You can import the Router and/or RouteMixin from the package and use it to extends the web component class
```javascript
import { Router, RouteMixin } from 'simple-wc-router';

class SomeComponent extends Router(SomeWebComponentLibrary) {
```

---

## Router

To make sure the routing works as intended, please add a base tag to your root HTML page, like so:
```html
<base href="/">
```
The base href itself does not have to be `/`.

The Router is a class mixin which you can use to extend your webcomponent. The following example will show you how to use it.

### Exampe with Lit Element

> As of version 2.1.0 a render method is added to the route definitions.

> As of version 2.3.0 you can have optional path parts.

You can make use of [dynamic imports](https://v8.dev/features/dynamic-import) if your build tooling supports it. If not make sure the components have been (imported and) defined. The imported component will be passed a `routeProps` object containing the properties that are set in the route.

You can define paths as: 

| Type | Syntax | Explanation |
| ---- | ------ | ----------- |
| Normal | `/stocks/latest` | This route can only be exactly matched. |
| Dynamic | `/stocks/:type` | This route contains the variable *type*, the value will be provided as routeProps to the given component. |
| Optional | `/stocks/:type/:?period` | The route contains both a variable *type* and *period*. Where *period* is optional. The route will be matched with and without the *period* route part. |
| Wildcard | `*` | This is a fallback pattern if no routes are matched. |

**app.js**
```javascript
import { LitElement, html } from 'lit-element';
import { Router } from 'simple-wc-router';
import './pages/page_home';
import './components';

const globalProp = "version-1.2.3";

class App extends Router(LitElement) {
    static get routes() {
        return [
            // Root path
            {
                path: "/",
                component: "page-home"
            },
            // Using 'type' and 'day' variable.
            {
                path: "/stock/:type/:day",
                component: "page-stocks",
                import: () => import("./src/page_stock.js")
            },
            // Using 'stockId' and optionally 'againstRate' variable.
            {
                path: "/trade/:stockId/:?againstRate",
                component: "page-trade",
                import: () => import("./src/page_trade.js")
            },
            // Using 'category' variable.
            {
                path: "/news/:category",
                render: routeProps => html`
                    <page-news 
                        .category=${routeProps.category} 
                        .someOtherGlobalProp=${globalProp}>
                    </page-news>`,
                import: () => import("./src/page_news.js")
            },
            // Fallback for all unmatched routes.  
            {
                path: "*",
                render: () => html`<h2>404 The requested page could not be found</h2>`
            }
        ];
    }
    render() {
        return html`
            <app-header>
                <h1 slot="left">... some title goes here ...</h1>
                <nav slot="right">... some navigation goes here ...</nav>
            </app-header>
            <main>
                ${this.routeElement}
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
| 2.1.0   | Added a render method to the route definition.                                   |
| 2.2.0   | Added wildcard posibility.                                                       |
| 2.2.1   | Changed the documentation.                                                       |
| 2.3.0   | Added optional routing based on the suggestion JaySunSyn                         |
| 2.3.1   | Fixed NPM audit finding                                                          |
| 2.3.2   | Improved documentation                                                           |
| 2.3.3   | Improved documentation                                                           |
| 2.3.4   | Improved build size                                                              |
