import { matcher } from "./matcher.js";
import {
  CreateElement,
  PushState,
  ReplaceState,
  AddEvent,
  RemoveEvent,
  DispatchEvent,
  isFunction,
  startLocation,
} from "./helpers.js";
import { Errors } from "./constants.js";

const Router = (superClass) =>
  class extends superClass {
    static get properties() {
      return {
        route: String,
        routeProps: Object,
        routeElement: String,
        __lastRoute: String,
      };
    }

    constructor() {
      super();
      const route = startLocation();
      this.routeProps = {};
      this.lastRoute = null;
      ReplaceState({ route }, null, route);
    }

    connectedCallback() {
      super.connectedCallback();
      this.__boundFindMatchingRoute = this.__findMatchingRoute.bind(this);
      AddEvent("popstate", this.__boundFindMatchingRoute);
      DispatchEvent(
        new PopStateEvent("popstate", { state: { route: startLocation() } })
      );
    }

    disconnectedCallback() {
      super.disconnectedCallback();
      RemoveEvent("popstate", this.__boundFindMatchingRoute);
    }

    __findMatchingRoute(ev) {
      if (!this.constructor.routes) throw Errors.Router.NoRoutes;
      const targetRoute = ev.state.route;
      const match = matcher(this.constructor.routes, targetRoute);
      if (match) {
        this.route = match.route;
        this.routeProps = match.props;
      }
      if (this.__lastRoute !== targetRoute) {
        this.__setRouteElement();
        this.__lastRoute = targetRoute;
      }
    }

    __setRouteElement() {
      const setElement = () => {
        let element;
        if (isFunction(this.route.render)) {
          element = this.route.render(this.routeProps);
        } else {
          element = CreateElement(this.route.component);
          Object.assign(element, this.routeProps);
        }

        this.routeElement = element;
      };

      if (!this.route) {
        this.routeElement = null;
      } else if (
        !customElements.get(this.route.component) &&
        isFunction(this.route.import)
      ) {
        this.route.import().then(setElement);
      } else {
        setElement();
      }
    }
  };

const RouteManager = () => {
  console.log(`
    RouteManager:
    =============

    - RouteManager.navigate 
    - RouteManager.getBase
  `);
  return this;
};
Object.assign(RouteManager, {
  navigate: (route) => {
    if (!route) throw Errors.RouteManager.NoRoute;
    if (route === window.location.pathname) return;
    if (route.substring(0, 1) !== "/") {
      window.location.href = route;
      return;
    }

    const state = { route };
    PushState(state, null, route);
    DispatchEvent(new PopStateEvent("popstate", { state }));
  },
  getBase: () => document.baseURI,
});

export { Router, RouteManager };
