var _a;
import { EventHandlerUtil, getUniqueIdWithPrefix, getObjectPropertyValueByKey, stringSnakeToCamel, getAttributeValueByBreakpoint, throttle, getCSS, DOMEventHandlerUtil, ElementStyleUtil, } from '../_utils/index';
export class DrawerStore {
    static set(instanceId, drawerComponentObj) {
        if (DrawerStore.has(instanceId)) {
            return;
        }
        DrawerStore.store.set(instanceId, drawerComponentObj);
    }
    static get(instanceId) {
        if (!DrawerStore.has(instanceId)) {
            return;
        }
        return DrawerStore.store.get(instanceId);
    }
    static remove(instanceId) {
        if (!DrawerStore.has(instanceId)) {
            return;
        }
        DrawerStore.store.delete(instanceId);
    }
    static has(instanceId) {
        return DrawerStore.store.has(instanceId);
    }
    static getAllInstances() {
        return DrawerStore.store;
    }
}
DrawerStore.store = new Map();
const defaultDrawerOptions = {
    overlay: true,
    baseClass: 'drawer',
    overlayClass: 'drawer-overlay',
    direction: 'end',
};
class DrawerComponent {
    constructor(_element, options) {
        this.overlayElement = null;
        this.toggleElement = null;
        this.name = '';
        this.shown = false;
        this.lastWidth = 0;
        this.closeElement = null;
        this._handlers = () => {
            const togglers = this._getOption('toggle');
            const closers = this._getOption('close');
            if (togglers !== null && togglers.length > 0) {
                DOMEventHandlerUtil.on(document.body, togglers, 'click', (e) => {
                    e.preventDefault();
                    this.toggleElement = document.getElementById(togglers);
                    this._toggle();
                });
            }
            if (closers !== null && closers.length > 0) {
                DOMEventHandlerUtil.on(document.body, closers, 'click', (e) => {
                    e.preventDefault();
                    this.closeElement = document.getElementById(closers);
                    this._hide();
                });
            }
        };
        this._update = () => {
            const width = String(this._getOption('width'));
            const direction = String(this._getOption('direction'));
            // Reset state
            const hasBaseClass = this.element.classList.contains(`${this.options.baseClass}-on`);
            const bodyCanvasAttr = String(document.body.getAttribute(`data-kt-drawer-${this.name}-`));
            if (hasBaseClass === true && bodyCanvasAttr === 'on') {
                this.shown = true;
            }
            else {
                this.shown = false;
            }
            // Activate/deactivate
            if (this._getOption('activate') === true) {
                this.element.classList.add(this.options.baseClass);
                this.element.classList.add(`${this.options.baseClass}-${direction}`);
                ElementStyleUtil.set(this.element, 'width', width, true);
                this.lastWidth = parseInt(width);
            }
            else {
                ElementStyleUtil.set(this.element, 'width', '');
                this.element.classList.remove(this.options.baseClass);
                this.element.classList.remove(`${this.options.baseClass}-${direction}`);
                this._hide();
            }
        };
        this._getOption = (name) => {
            const attr = this.element.getAttribute(`data-kt-drawer-${name}`);
            if (attr) {
                let value = getAttributeValueByBreakpoint(attr);
                if (value !== null && String(value) === 'true') {
                    return true;
                }
                else {
                    if (value !== null && String(value) === 'false') {
                        return false;
                    }
                }
                return value;
            }
            else {
                const optionName = stringSnakeToCamel(name);
                const option = getObjectPropertyValueByKey(this.options, optionName);
                if (option) {
                    return getAttributeValueByBreakpoint(option);
                }
                else {
                    return null;
                }
            }
        };
        this._toggle = () => {
            if (EventHandlerUtil.trigger(this.element, 'kt.drawer.toggle') === false) {
                return;
            }
            if (this.shown) {
                this._hide();
            }
            else {
                this._show();
            }
            EventHandlerUtil.trigger(this.element, 'kt.drawer.toggled');
        };
        this._hide = () => {
            if (EventHandlerUtil.trigger(this.element, 'kt.drawer.hide') === false) {
                return;
            }
            this.shown = false;
            this._deleteOverlay();
            document.body.removeAttribute(`data-kt-drawer-${this.name}`);
            document.body.removeAttribute(`data-kt-drawer`);
            this.element.classList.remove(`${this.options.baseClass}-on`);
            if (this.toggleElement != null) {
                this.toggleElement.classList.remove('active');
            }
            EventHandlerUtil.trigger(this.element, 'kt.drawer.after.hidden');
        };
        this._show = () => {
            if (EventHandlerUtil.trigger(this.element, 'kt.drawer.show') === false) {
                return;
            }
            this.shown = true;
            this._createOverlay();
            document.body.setAttribute(`data-kt-drawer-${this.name}`, 'on');
            document.body.setAttribute('data-kt-drawer', 'on');
            this.element.classList.add(`${this.options.baseClass}-on`);
            if (this.toggleElement !== null) {
                this.toggleElement.classList.add('active');
            }
            EventHandlerUtil.trigger(this.element, 'kt.drawer.shown');
        };
        this._createOverlay = () => {
            if (this._getOption('overlay') === true) {
                this.overlayElement = document.createElement('DIV');
                const elementZIndex = getCSS(this.element, 'z-index');
                if (elementZIndex) {
                    const overlayZindex = parseInt(elementZIndex) - 1;
                    ElementStyleUtil.set(this.overlayElement, 'z-index', overlayZindex); // update
                }
                document.body.append(this.overlayElement);
                const overlayClassOption = this._getOption('overlay-class');
                if (overlayClassOption) {
                    this.overlayElement.classList.add(overlayClassOption.toString());
                }
                this.overlayElement.addEventListener('click', (e) => {
                    e.preventDefault();
                    this._hide();
                });
            }
        };
        this._deleteOverlay = () => {
            if (this.overlayElement !== null && this.overlayElement.parentNode) {
                this.overlayElement.parentNode.removeChild(this.overlayElement);
            }
        };
        this._getDirection = () => {
            return String(this._getOption('direction')) === 'left' ? 'left' : 'right';
        };
        this._getWidth = () => {
            let width = this._getOption('width');
            if (width && width === 'auto') {
                width = getCSS(this.element, 'width');
            }
            return width;
        };
        ///////////////////////
        // ** Public API  ** //
        ///////////////////////
        this.toggle = () => {
            this._toggle();
        };
        this.show = () => {
            this._show();
        };
        this.hide = () => {
            this._hide();
        };
        this.isShown = () => {
            return this.shown;
        };
        this.update = () => {
            this._update();
        };
        this.goElement = () => {
            return this.element;
        };
        // Event API
        this.on = (name, handler) => {
            return EventHandlerUtil.on(this.element, name, handler);
        };
        this.one = (name, handler) => {
            return EventHandlerUtil.one(this.element, name, handler);
        };
        this.off = (name) => {
            return EventHandlerUtil.off(this.element, name);
        };
        this.trigger = (name, event) => {
            return EventHandlerUtil.trigger(this.element, name, event);
        };
        this.element = _element;
        this.options = Object.assign(defaultDrawerOptions, options);
        this.instanceUid = getUniqueIdWithPrefix('drawer');
        this.overlayElement = null;
        this.name = this.element.getAttribute('data-kt-drawer-name') || '';
        this.shown = false;
        this.toggleElement = null;
        // Event Handlers
        this._handlers();
        // Update Instance
        this._update();
        // Bind Instance
        DrawerStore.set(this.element.id, this);
    }
    // Create Instances
    static createInstances(selector) {
        const elements = document.body.querySelectorAll(selector);
        elements.forEach((element) => {
            const item = element;
            let drawer = DrawerComponent.getInstance(item.id);
            if (!drawer) {
                drawer = new DrawerComponent(item, defaultDrawerOptions);
            }
            drawer.element = item;
            drawer.hide();
        });
    }
    // Global Initialization
    static initGlobalHandlers() {
        // Window Resize Handling
        window.addEventListener('resize', function () {
            let timer;
            throttle(timer, () => {
                // Locate and update Drawer instances on window resize
                const elements = document.body.querySelectorAll('[data-kt-drawer="true"]');
                elements.forEach((el) => {
                    const item = el;
                    const instance = DrawerComponent.getInstance(item.id);
                    if (instance) {
                        instance.element = item;
                        instance.update();
                    }
                });
            }, 200);
        });
    }
}
_a = DrawerComponent;
// Static methods
DrawerComponent.hasInstace = (elementId) => {
    return DrawerStore.has(elementId);
};
DrawerComponent.getInstance = (elementId) => {
    return DrawerStore.get(elementId);
};
DrawerComponent.hideAll = () => {
    const oldInstances = DrawerStore.getAllInstances();
    oldInstances.forEach((dr) => {
        dr.hide();
    });
};
DrawerComponent.updateAll = () => {
    const oldInstances = DrawerStore.getAllInstances();
    oldInstances.forEach((dr) => {
        dr.update();
    });
};
// Dismiss instances
DrawerComponent.handleDismiss = () => {
    // External drawer toggle handler
    DOMEventHandlerUtil.on(document.body, '[data-kt-drawer-dismiss="true"]', 'click', () => {
        /* @ts-ignore */
        const element = _a.closest('[data-kt-drawer="true"]');
        if (element) {
            const drawer = DrawerComponent.getInstance(element);
            if (drawer && drawer.isShown()) {
                drawer.hide();
            }
        }
    });
};
DrawerComponent.bootstrap = () => {
    DrawerComponent.createInstances('[data-kt-drawer="true"]');
    DrawerComponent.initGlobalHandlers();
    DrawerComponent.handleDismiss();
};
DrawerComponent.reinitialization = () => {
    DrawerComponent.createInstances('[data-kt-drawer="true"]');
    DrawerComponent.hideAll();
    DrawerComponent.updateAll();
    DrawerComponent.handleDismiss();
};
export { DrawerComponent, defaultDrawerOptions };
