import { DataUtil, getUniqueIdWithPrefix, EventHandlerUtil } from '../_utils/index';
// Helpers
import { CookieComponent } from './_CookieComponent';
const defaultToggleOptions = {
    saveState: false,
};
class ToggleComponent {
    constructor(_element, options) {
        this.state = '';
        this.target = null;
        this.attribute = '';
        this._handlers = () => {
            this.element.addEventListener('click', (e) => {
                e.preventDefault();
                this._toggle();
            });
        };
        // Event handlers
        this._toggle = () => {
            // Trigger "after.toggle" event
            EventHandlerUtil.trigger(this.element, 'kt.toggle.change');
            if (this._isEnabled()) {
                this._disable();
            }
            else {
                this._enable();
            }
            // Trigger "before.toggle" event
            EventHandlerUtil.trigger(this.element, 'kt.toggle.changed');
            return this;
        };
        this._enable = () => {
            if (this._isEnabled()) {
                return;
            }
            EventHandlerUtil.trigger(this.element, 'kt.toggle.enable');
            this.target?.setAttribute(this.attribute, 'on');
            if (this.state.length > 0) {
                this.element.classList.add(this.state);
            }
            if (this.options.saveState) {
                CookieComponent.set(this.attribute, 'on', {});
            }
            EventHandlerUtil.trigger(this.element, 'kt.toggle.enabled');
            return this;
        };
        this._disable = () => {
            if (!this._isEnabled()) {
                return false;
            }
            EventHandlerUtil.trigger(this.element, 'kt.toggle.disable');
            this.target?.removeAttribute(this.attribute);
            if (this.state.length > 0) {
                this.element.classList.remove(this.state);
            }
            if (this.options.saveState) {
                CookieComponent.delete(this.attribute);
            }
            EventHandlerUtil.trigger(this.element, 'kt.toggle.disabled');
            return this;
        };
        this._isEnabled = () => {
            if (!this.target) {
                return false;
            }
            return String(this.target.getAttribute(this.attribute)).toLowerCase() === 'on';
        };
        ///////////////////////
        // ** Public API  ** //
        ///////////////////////
        // Plugin API
        // Plugin API
        this.toggle = () => {
            return this._toggle();
        };
        this.enable = () => {
            return this._enable();
        };
        this.disable = () => {
            return this._disable();
        };
        this.isEnabled = () => {
            return this._isEnabled();
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
        this.options = Object.assign(defaultToggleOptions, options);
        this.instanceUid = getUniqueIdWithPrefix('toggle');
        this.element = _element;
        const elementTargetAttr = this.element.getAttribute('data-kt-toggle-target');
        if (elementTargetAttr) {
            this.target = document.querySelector(elementTargetAttr);
        }
        const elementToggleAttr = this.element.getAttribute('data-kt-toggle-state');
        this.state = elementToggleAttr || '';
        this.attribute = 'data-kt-' + this.element.getAttribute('data-kt-toggle-name');
        // Event Handlers
        this._handlers();
        // Update Instance
        // Bind Instance
        DataUtil.set(this.element, 'toggle', this);
    }
}
// Static methods
ToggleComponent.getInstance = (el) => {
    const toggleElement = DataUtil.get(el, 'toggle');
    if (toggleElement) {
        return toggleElement;
    }
    return null;
};
ToggleComponent.createInstances = (selector) => {
    const elements = document.body.querySelectorAll(selector);
    elements.forEach((el) => {
        const item = el;
        let toggleElement = ToggleComponent.getInstance(item);
        if (!toggleElement) {
            toggleElement = new ToggleComponent(item, defaultToggleOptions);
        }
    });
};
ToggleComponent.createInsance = (selector, options = defaultToggleOptions) => {
    const element = document.body.querySelector(selector);
    if (!element) {
        return;
    }
    const item = element;
    let toggle = ToggleComponent.getInstance(item);
    if (!toggle) {
        toggle = new ToggleComponent(item, options);
    }
    return toggle;
};
ToggleComponent.reinitialization = () => {
    ToggleComponent.createInstances('[data-kt-toggle]');
};
ToggleComponent.bootstrap = () => {
    ToggleComponent.createInstances('[data-kt-toggle]');
};
export { ToggleComponent, defaultToggleOptions };
