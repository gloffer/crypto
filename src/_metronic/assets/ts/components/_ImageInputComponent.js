import { EventHandlerUtil, DataUtil, getUniqueIdWithPrefix, getCSS } from '../_utils/index';
const defaultImageInputOptions = {};
const defaultImageInputQueires = {
    componentName: 'image-input',
    instanseQuery: '[data-kt-image-input]',
    inputQuery: 'input[type="file"]',
    wrapperQuery: '.image-input-wrapper',
    cancelQuery: '[data-kt-image-input-action="cancel"]',
    removeQuery: '[data-kt-image-input-action="remove"]',
    hiddenQuery: 'input[type="hidden"]',
};
class ImageInputComponent {
    constructor(_element, _options, _queries) {
        this.src = '';
        this.value = '';
        // Event Handlers
        this._change = (e) => {
            e.preventDefault();
            if (this.inputElement !== null && this.inputElement.files && this.inputElement.files[0]) {
                // Fire change event
                if (EventHandlerUtil.trigger(this.element, 'kt.imageinput.change', e) === false) {
                    return;
                }
                const reader = new FileReader();
                reader.onload = (e) => {
                    if (this.wrapperElement && e.target) {
                        this.wrapperElement.style.setProperty('background-image', `url('${e.target.result}')`);
                    }
                };
                reader.readAsDataURL(this.inputElement.files[0]);
                this.element.classList.add('image-input-changed');
                this.element.classList.remove('image-input-empty');
                // Fire removed event
                EventHandlerUtil.trigger(this.element, 'kt.imageinput.changed', e);
            }
        };
        this._cancel = (e) => {
            e.preventDefault();
            // Fire cancel event
            if (EventHandlerUtil.trigger(this.element, 'kt.imageinput.cancel', e) === false) {
                return;
            }
            this.element.classList.remove('image-input-changed');
            this.element.classList.remove('image-input-empty');
            this.element.style.setProperty('background-image', this.src);
            if (this.inputElement) {
                this.inputElement.value = '';
            }
            if (this.hiddenElement !== null) {
                this.hiddenElement.value = '0';
            }
            // Fire canceled event
            EventHandlerUtil.trigger(this.element, 'kt.imageinput.canceled', e);
        };
        this._remove = (e) => {
            e.preventDefault();
            // Fire remove event
            if (EventHandlerUtil.trigger(this.element, 'kt.imageinput.remove', e) === false) {
                return;
            }
            this.element.classList.remove('image-input-changed');
            this.element.classList.add('image-input-empty');
            if (this.wrapperElement) {
                this.wrapperElement.style.setProperty('background-image', 'none');
            }
            if (this.inputElement) {
                this.inputElement.value = '';
            }
            if (this.hiddenElement !== null) {
                this.hiddenElement.value = '1';
            }
            // Fire removed event
            EventHandlerUtil.trigger(this.element, 'kt.imageinput.removed', e);
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
        // Variables
        this.options = Object.assign(defaultImageInputOptions, _options);
        this.queries = _queries;
        this.uid = getUniqueIdWithPrefix(this.queries.componentName);
        // Elements
        this.element = _element;
        this.inputElement = this.element.querySelector(this.queries.inputQuery);
        this.wrapperElement = this.element.querySelector(this.queries.wrapperQuery);
        this.cancelElement = this.element.querySelector(this.queries.cancelQuery);
        this.removeElement = this.element.querySelector(this.queries.removeQuery);
        this.hiddenElement = this.element.querySelector(this.queries.hiddenQuery);
        if (this.wrapperElement) {
            this.src = getCSS(this.wrapperElement, 'backgroundImage');
        }
        // Event Handlers
        this.handlers();
        DataUtil.set(this.element, this.queries.componentName, this);
    }
    handlers() {
        this.element.addEventListener('change', this._change);
        if (this.cancelElement) {
            this.cancelElement.addEventListener('click', this._cancel);
        }
        if (this.removeElement) {
            this.removeElement.addEventListener('click', this._cancel);
        }
    }
    ///////////////////////
    // ** Public API  ** //
    ///////////////////////
    getInputElement() {
        return this.inputElement;
    }
    getElement() {
        return this.element;
    }
}
// Static methods
ImageInputComponent.getInstance = (el, componentName = defaultImageInputQueires.componentName) => {
    const ImageInput = DataUtil.get(el, componentName);
    if (ImageInput) {
        return ImageInput;
    }
    return null;
};
ImageInputComponent.createInstances = (selector = defaultImageInputQueires.instanseQuery, options = defaultImageInputOptions, queries = defaultImageInputQueires) => {
    const elements = document.body.querySelectorAll(selector);
    elements.forEach((el) => {
        const item = el;
        let ImageInput = ImageInputComponent.getInstance(item);
        if (!ImageInput) {
            ImageInput = new ImageInputComponent(item, options, queries);
        }
    });
};
ImageInputComponent.createInsance = (selector = defaultImageInputQueires.instanseQuery, options = defaultImageInputOptions, queries = defaultImageInputQueires) => {
    const element = document.body.querySelector(selector);
    if (!element) {
        return;
    }
    const item = element;
    let ImageInput = ImageInputComponent.getInstance(item);
    if (!ImageInput) {
        ImageInput = new ImageInputComponent(item, options, queries);
    }
    return ImageInput;
};
ImageInputComponent.bootstrap = (selector = defaultImageInputQueires.instanseQuery) => {
    ImageInputComponent.createInstances(selector);
};
ImageInputComponent.reinitialization = (selector = defaultImageInputQueires.instanseQuery) => {
    ImageInputComponent.createInstances(selector);
};
export { ImageInputComponent, defaultImageInputOptions, defaultImageInputQueires };
