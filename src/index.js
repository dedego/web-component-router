import { matcher } from './matcher';

const DCE = document.createElement.bind(document);
const HPS = history.pushState.bind(history);
const HRS = history.replaceState.bind(history);
const WRE = window.removeEventListener.bind(window);
const WDE = window.dispatchEvent.bind(window);
const WAE = window.addEventListener.bind(window);

const Errors = {
  Router: {
    NoRoutes: "Router :: No routes were defined!"
  },
  RouteMixin: {
    NoRoute:
      "RouteMixin :: `navigate` method requires the ### component to have a route property/attribute"
  }
};

const startLocation = () => window.location.pathname || "/";

const Router = superClass =>
  class extends superClass {
    static get properties() {
      return {
        routes: Array,
        route: String,
        routeProps: Object,
        routeElement: String,
        lastRoute: String
      };
    }
    constructor() {
      super();
      const route = startLocation();
      this.routeProps = {};
      this.lastRoute = null;
      HRS({ route }, null, route);
    }
    connectedCallback() {
      super.connectedCallback();
      WAE("popstate", this.__handleNav.bind(this));
      WDE(new PopStateEvent("popstate", { state: { route: startLocation() } }));
    }
    disconnectedCallback() {
      super.disconnectedCallback();
      WRE("popstate", this.__handleNav.bind(this));
    }
    __handleNav(ev) {
      if (!this.constructor.routes) throw Errors.Router.NoRoutes;
      const targetRoute = ev.state.route;
      const match = matcher(this.constructor.routes, targetRoute);
      if (match) {
        this.route = match.route;
        this.routeProps = match.props;
      }
      if (this.lastRoute !== targetRoute) {
        this.setRouteElement();
        this.lastRoute = targetRoute;
      }
    }
    setRouteElement() {
      const setElement = () => {
        let element;
        if( typeof this.route.render === "function" ) {
          element = this.route.render(this.routeProps);
        } else {
          element = DCE(this.route.component);
          Object.assign(element, this.routeProps);
        }
        
        this.routeElement = element;
      };
      if (!this.route) {
        this.routeElement = null;
      } else if (
        !customElements.get(this.route.component) &&
        typeof this.route.import === "function"
      ) {
        this.route.import().then(setElement);
      } else {
        setElement();
      }
    }
  };

const RouteMixin = superClass =>
  class extends superClass {
    static get properties() {
      return {
        isRouteActive: Boolean
      };
    }
    connectedCallback() {
      super.connectedCallback();
      this.isRouteActive = this.route === window.location.pathname;
      WAE("popstate", this.__handleActive.bind(this));
    }
    disconnectedCallback() {
      super.disconnectedCallback();
      WRE("popstate", this.__handleActive.bind(this));
    }
    __handleActive(ev) {
      this.isRouteActive = ev.state.route === this.route;
    }
    navigate( customRoute ) {
      const route = customRoute ? customRoute : this.route;
      if (!route) throw Errors.RouteMixin.NoRoute.replace('###', this.nodeName);
      if (route === window.location.pathname) return;
      if (route.substring(0, 1) !== '/') {
        window.location.href = route;
        return;
      }

      const state = { route };
      HPS(state, null, route);
      WDE(new PopStateEvent("popstate", { state }));
    }
  };

export { Router, RouteMixin };
