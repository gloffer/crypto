import { getElementIndex, getUniqueIdWithPrefix, ElementAnimateUtil, EventHandlerUtil, DataUtil, DOMEventHandlerUtil, ElementStyleUtil, } from '../_utils/index';
const defaultStepperOptions = {
    startIndex: 1,
    animation: false,
    animationSpeed: '0.3s',
    animationNextClass: 'animate__animated animate__slideInRight animate__fast',
    animationPreviousClass: 'animate__animated animate__slideInLeft animate__fast',
};
class StepperComponent {
    constructor(_element, options) {
        this.totatStepsNumber = 0;
        this.passedStepIndex = 0;
        this.currentStepIndex = 1;
        this._goTo = (index) => {
            EventHandlerUtil.trigger(this.element, 'kt.stepper.change');
            // Skip if this step is already shown
            if (index === this.currentStepIndex || index > this.totatStepsNumber || index < 0) {
                return;
            }
            // Validate step number
            index = parseInt(index.toString());
            // Set current step
            this.passedStepIndex = this.currentStepIndex;
            this.currentStepIndex = index;
            // Refresh elements
            this.refreshUI();
            EventHandlerUtil.trigger(this.element, 'kt.stepper.changed');
        };
        this.initHandlers = () => {
            this.btnNext?.addEventListener('click', (e) => {
                e.preventDefault();
                EventHandlerUtil.trigger(this.element, 'kt.stepper.next', e);
            });
            this.btnPrev?.addEventListener('click', (e) => {
                e.preventDefault();
                EventHandlerUtil.trigger(this.element, 'kt.stepper.previous', e);
            });
            DOMEventHandlerUtil.on(this.element, '[data-kt-stepper-action="step"]', 'click', (e) => {
                e.preventDefault();
                if (this.steps && this.steps.length > 0) {
                    for (let i = 0; i < this.steps.length; i++) {
                        if (this.steps[i] === this.element) {
                            let index = i + 1;
                            const stepDirection = this._getStepDirection(index);
                            EventHandlerUtil.trigger(this.element, `stepper.${stepDirection}`, e);
                            return;
                        }
                    }
                }
            });
        };
        this._getStepDirection = (index) => {
            return index > this.currentStepIndex ? 'next' : 'previous';
        };
        this.getStepContent = (index) => {
            const content = this.element.querySelectorAll('[data-kt-stepper-element="content"]');
            if (!content) {
                return false;
            }
            if (content[index - 1]) {
                return content[index - 1];
            }
            return false;
        };
        this.getLastStepIndex = () => {
            return this.totatStepsNumber;
        };
        this.getTotalStepsNumber = () => {
            return this.totatStepsNumber;
        };
        this.refreshUI = () => {
            let state = '';
            if (this.isLastStep()) {
                state = 'last';
            }
            else if (this.isFirstStep()) {
                state = 'first';
            }
            else {
                state = 'between';
            }
            // Set state class
            this.element.classList.remove('last');
            this.element.classList.remove('first');
            this.element.classList.remove('between');
            this.element.classList.add(state);
            // Step Items
            const elements = this.element.querySelectorAll('[data-kt-stepper-element="nav"], [data-kt-stepper-element="content"], [data-kt-stepper-element="info"]');
            if (!elements || elements.length <= 0) {
                return;
            }
            for (var i = 0, len = elements.length; i < len; i++) {
                var element = elements[i];
                var index = getElementIndex(element) + 1;
                element.classList.remove('current');
                element.classList.remove('completed');
                element.classList.remove('pending');
                if (index === this.currentStepIndex) {
                    element.classList.add('current');
                    if (this.options.animation !== false &&
                        element.getAttribute('data-kt-stepper-element') === 'content') {
                        ElementStyleUtil.set(element, 'animationDuration', this.options.animationSpeed);
                        const animation = this._getStepDirection(this.passedStepIndex) === 'previous'
                            ? this.options.animationPreviousClass
                            : this.options.animationNextClass;
                        ElementAnimateUtil.animateClass(element, animation);
                    }
                }
                else {
                    if (index < this.currentStepIndex) {
                        element.classList.add('completed');
                    }
                    else {
                        element.classList.add('pending');
                    }
                }
            }
        };
        this.isLastStep = () => {
            return this.currentStepIndex === this.totatStepsNumber;
        };
        this.isFirstStep = () => {
            return this.currentStepIndex === 1;
        };
        this.isBetweenStep = () => {
            return this.isLastStep() === false && this.isFirstStep() === false;
        };
        //   ///////////////////////
        //   // ** Public API  ** //
        //   ///////////////////////
        //   // Plugin API
        this.goto = (index) => {
            return this._goTo(index);
        };
        this.goNext = () => {
            return this.goto(this.getNextStepIndex());
        };
        this.goPrev = () => {
            return this.goto(this.getPrevStepIndex());
        };
        this.goFirst = () => {
            return this.goto(1);
        };
        this.goLast = () => {
            return this.goto(this.getLastStepIndex());
        };
        this.getCurrentStepIndex = () => {
            return this.currentStepIndex;
        };
        this.getNextStepIndex = () => {
            if (this.totatStepsNumber >= this.currentStepIndex + 1) {
                return this.currentStepIndex + 1;
            }
            else {
                return this.totatStepsNumber;
            }
        };
        this.getPassedStepIndex = () => {
            return this.passedStepIndex;
        };
        this.getPrevStepIndex = () => {
            if (this.currentStepIndex - 1 > 1) {
                return this.currentStepIndex - 1;
            }
            else {
                return 1;
            }
        };
        this.getElement = (index) => {
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
        this.destroy = () => {
            console.log('destroy stepper');
        };
        this.trigger = (name, event) => {
            return EventHandlerUtil.trigger(this.element, name, event);
        };
        this.element = _element;
        this.options = Object.assign(defaultStepperOptions, options);
        this.instanceUid = getUniqueIdWithPrefix('stepper');
        // Elements
        this.steps = this.element.querySelectorAll('[data-kt-stepper-element="nav"]');
        this.btnNext = this.element.querySelector('[data-kt-stepper-action="next"]');
        this.btnPrev = this.element.querySelector('[data-kt-stepper-action="previous"]');
        this.btnSubmit = this.element.querySelector('[data-kt-stepper-action="submit"]');
        // Variables
        this.totatStepsNumber = this.steps?.length | 0;
        this.passedStepIndex = 0;
        this.currentStepIndex = 1;
        // Set Current Step
        if (this.options.startIndex > 1) {
            this._goTo(this.options.startIndex);
        }
        // Event Handlers
        this.initHandlers();
        // Bind Instance
        DataUtil.set(this.element, 'stepper', this);
    }
    // Static methods
    static hasInstace(element) {
        return DataUtil.has(element, 'stepper');
    }
    static getInstance(element) {
        if (element !== null && StepperComponent.hasInstace(element)) {
            return DataUtil.get(element, 'stepper');
        }
        return null;
    }
    // Create Instances
    static createInstances(selector) {
        const elements = document.body.querySelectorAll(selector);
        elements.forEach((element) => {
            const item = element;
            let stepper = StepperComponent.getInstance(item);
            if (!stepper) {
                stepper = new StepperComponent(item, defaultStepperOptions);
            }
        });
    }
    static bootstrap(attr = '[data-kt-stepper]') {
        StepperComponent.createInstances(attr);
    }
}
StepperComponent.createInsance = (element, options = defaultStepperOptions) => {
    if (!element) {
        return null;
    }
    let stepper = StepperComponent.getInstance(element);
    if (!stepper) {
        stepper = new StepperComponent(element, options);
    }
    return stepper;
};
export { StepperComponent, defaultStepperOptions };
