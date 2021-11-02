import { EventHandlerUtil, DataUtil, getBreakpoint, getAttributeValueByBreakpoint, stringSnakeToCamel, getObjectPropertyValueByKey, getViewPort, isVisibleElement, throttle, } from '../_utils/index';
import { MenuComponent, defaultMenuOptions } from './MenuComponent';
const defaultSearchOptions = {
    minLength: 2,
    keypress: true,
    enter: true,
    layout: 'menu',
    showOnFocus: true, // Always show menu on input focus
};
const defaultSearchQueires = {
    componentName: 'search',
    instanseQuery: '[data-kt-search]',
    attrQuery: 'data-kt-search-',
};
class SearchComponent {
    constructor(_element, _options, _queries) {
        this.processing = false;
        this._getElement = (name) => {
            return this.element.querySelector('[data-kt-search-element="' + name + '"]');
        };
        // Get option
        this.getOption = (name) => {
            const attr = this.element.getAttribute(`${this.queries.attrQuery}${name}`);
            if (attr) {
                let value = getAttributeValueByBreakpoint(attr);
                if (value !== null && String(value) === 'true') {
                    return true;
                }
                else if (value !== null && String(value) === 'false') {
                    return false;
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
        // Check if responsive form mode is enabled
        this.getResponsiveFormMode = () => {
            const responsive = this.getOption('responsive');
            const width = getViewPort().width;
            if (!responsive) {
                return null;
            }
            const breakpoint = getBreakpoint(responsive);
            let breakPointNum = -1;
            if (!breakpoint) {
                breakPointNum = parseInt(responsive);
            }
            else {
                breakPointNum = +breakpoint;
            }
            if (width < breakPointNum) {
                return 'on';
            }
            else {
                return 'off';
            }
        };
        // Focus
        this.focus = () => {
            this.element.classList.add('focus');
            if (this.getOption('show-on-focus') === true ||
                this.inputElement.value.length >= this.options.minLength) {
                this.show();
            }
        };
        // Blur
        this.blur = () => {
            this.element.classList.remove('focus');
        };
        // Enter
        this.enter = (e) => {
            const key = e.charCode || e.keyCode || 0;
            if (key === 13) {
                e.preventDefault();
                this.search();
            }
        };
        // Input
        this.input = () => {
            if (this.getOption('min-length')) {
                const minLength = parseInt(this.getOption('min-length'));
                if (this.inputElement.value.length >= minLength) {
                    this.search();
                }
                else if (this.inputElement.value.length === 0) {
                    this.clear();
                }
            }
        };
        ///////////////////////
        // ** Public API  ** //
        ///////////////////////
        // Update
        this.update = () => {
            // Handle responsive form
            if (this.layout === 'menu') {
                let responsiveFormMode = this.getResponsiveFormMode();
                if (responsiveFormMode === 'on' && this.contentElement.contains(this.formElement) === false) {
                    this.contentElement.prepend(this.formElement);
                    this.formElement.classList.remove('d-none');
                }
                else if (responsiveFormMode === 'off' &&
                    this.contentElement.contains(this.formElement) === true) {
                    this.element.prepend(this.formElement);
                    this.formElement.classList.add('d-none');
                }
            }
        };
        // Show menu
        this.show = () => {
            if (this.menuObject) {
                this.update();
                this.menuObject.show(this.element);
            }
        };
        // Hide menu
        this.hide = () => {
            if (this.menuObject) {
                this.update();
                this.menuObject.hide(this.element);
            }
        };
        // Search
        this.search = () => {
            if (this.processing === false) {
                // Show search spinner
                if (this.spinnerElement) {
                    this.spinnerElement.classList.remove('d-none');
                }
                // Hide search clear button
                if (this.clearElement) {
                    this.clearElement.classList.add('d-none');
                }
                // Hide search toolbar
                if (this.toolbarElement) {
                    this.toolbarElement.classList.add('d-none');
                }
                // Focus input
                this.inputElement.focus();
                this.processing = true;
                EventHandlerUtil.trigger(this.element, 'kt.search.process');
            }
        };
        // Complete
        this.complete = () => {
            if (this.spinnerElement) {
                this.spinnerElement.classList.add('d-none');
            }
            // Show search toolbar
            if (this.clearElement) {
                this.clearElement.classList.remove('d-none');
            }
            if (this.inputElement.value.length === 0) {
                this.clear();
            }
            // Focus input
            this.inputElement.focus();
            this.show();
            this.processing = false;
        };
        // Clear
        this.clear = () => {
            if (EventHandlerUtil.trigger(this.element, 'kt.search.clear') === false) {
                return;
            }
            // Clear and focus input
            this.inputElement.value = '';
            this.inputElement.focus();
            // Hide clear icon
            if (this.clearElement) {
                this.clearElement.classList.add('d-none');
            }
            // Show search toolbar
            if (this.toolbarElement) {
                this.toolbarElement.classList.remove('d-none');
            }
            // Hide menu
            if (this.getOption('show-on-focus') === false) {
                this.hide();
            }
            EventHandlerUtil.trigger(this.element, 'kt.search.cleared');
        };
        this.isProcessing = () => {
            return this.processing;
        };
        this.getQuery = () => {
            return this.inputElement.value;
        };
        this.getMenu = () => {
            return this.menuObject;
        };
        this.getFormElement = () => {
            return this.formElement;
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
        // Variables
        this.options = Object.assign(defaultSearchOptions, _options);
        this.queries = _queries;
        // Elements
        this.element = _element;
        this.contentElement = this._getElement('content');
        this.formElement = this._getElement('form');
        this.inputElement = this._getElement('input');
        this.spinnerElement = this._getElement('spinner');
        this.clearElement = this._getElement('clear');
        this.toggleElement = this._getElement('toggle');
        this.submitElement = this._getElement('submit');
        this.toolbarElement = this._getElement('toolbar');
        this.resultsElement = this._getElement('results');
        this.suggestionElement = this._getElement('suggestion');
        this.emptyElement = this._getElement('empty');
        // Layout
        this.layout = this.getOption('layout');
        if (this.layout === 'menu') {
            this.menuObject = new MenuComponent(this.contentElement, defaultMenuOptions);
        }
        // Update
        this.update();
        // Event Handlers
        this.handlers();
        DataUtil.set(this.element, this.queries.componentName, this);
    }
    handlers() {
        // Focus
        this.inputElement.addEventListener('focus', this.focus);
        // Blur
        this.inputElement.addEventListener('blur', this.blur);
        // Keypress
        if (this.getOption('keypress') === true) {
            this.inputElement.addEventListener('input', this.input);
        }
        // Submit
        if (this.submitElement) {
            this.submitElement.addEventListener('click', this.search);
        }
        // Enter
        if (this.getOption('enter') === true) {
            this.inputElement.addEventListener('keypress', this.enter);
        }
        // Clear
        if (this.clearElement) {
            this.clearElement.addEventListener('click', this.clear);
        }
        // Menu
        if (this.menuObject) {
            // Toggle menu
            if (this.toggleElement) {
                this.toggleElement.addEventListener('click', this.show);
                this.menuObject.on('kt.menu.dropdown.show', function () {
                    // @ts-ignore
                    if (isVisibleElement(this.toggleElement)) {
                        // @ts-ignore
                        this.toggleElement.classList.add('active');
                        // @ts-ignore
                        this.toggleElement.classList.add('show');
                    }
                });
                this.menuObject.on('kt.menu.dropdown.hide', function () {
                    // @ts-ignore
                    if (isVisibleElement(this.toggleElement)) {
                        // @ts-ignore
                        this.toggleElement.classList.remove('active');
                        // @ts-ignore
                        this.toggleElement.classList.remove('show');
                    }
                });
            }
            this.menuObject.on('kt.menu.dropdown.shown', function () {
                // @ts-ignore
                this.inputElement.focus();
            });
        }
        // Window resize handling
        window.addEventListener('resize', () => {
            let timer;
            throttle(timer, () => {
                this.update();
            }, 200);
        });
    }
    getInputElement() {
        return this.inputElement;
    }
    getContentElement() {
        return this.contentElement;
    }
    getElement() {
        return this.element;
    }
}
// Static methods
SearchComponent.getInstance = (el, componentName = defaultSearchQueires.componentName) => {
    const Search = DataUtil.get(el, componentName);
    if (Search) {
        return Search;
    }
    return null;
};
SearchComponent.createInstances = (selector = defaultSearchQueires.instanseQuery, options = defaultSearchOptions, queries = defaultSearchQueires) => {
    const elements = document.body.querySelectorAll(selector);
    elements.forEach((el) => {
        const item = el;
        let Search = SearchComponent.getInstance(item);
        if (!Search) {
            Search = new SearchComponent(item, options, queries);
        }
    });
};
SearchComponent.createInsance = (selector = defaultSearchQueires.instanseQuery, options = defaultSearchOptions, queries = defaultSearchQueires) => {
    const element = document.body.querySelector(selector);
    if (!element) {
        return;
    }
    const item = element;
    let Search = SearchComponent.getInstance(item);
    if (!Search) {
        Search = new SearchComponent(item, options, queries);
    }
    return Search;
};
SearchComponent.bootstrap = (selector = defaultSearchQueires.instanseQuery) => {
    SearchComponent.createInstances(selector);
};
SearchComponent.reinitialization = (selector = defaultSearchQueires.instanseQuery) => {
    SearchComponent.createInstances(selector);
};
export { SearchComponent, defaultSearchOptions, defaultSearchQueires };
