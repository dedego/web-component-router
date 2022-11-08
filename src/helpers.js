const CreateElement = document.createElement.bind(document);
const PushState = history.pushState.bind(history);
const ReplaceState = history.replaceState.bind(history);
const AddEvent = window.addEventListener.bind(window);
const RemoveEvent = window.removeEventListener.bind(window);
const DispatchEvent = window.dispatchEvent.bind(window);
const isFunction = fn => typeof fn === "function";
const startLocation = () => window.location.pathname || "/";

export {
    CreateElement,
    PushState,
    ReplaceState,
    AddEvent,
    RemoveEvent,
    DispatchEvent,
    isFunction,
    startLocation
};