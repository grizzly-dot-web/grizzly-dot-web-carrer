import AtomicRoutingComponent from "../_shared/Components/Abstract/AtomicRoutingComponent/client";

export default class Router {

    private _appElement : HTMLElement|null;
    private _components : AtomicRoutingComponent[]
    private _detectionTimeout : any;
    private _lastActiveComponents : AtomicRoutingComponent[]

    public get currentUrl() {
        return window.location.pathname;
    }

    public addComponent(component : AtomicRoutingComponent) {
        this._components.push(component);
    }

    constructor(app : HTMLElement) {
        this.componentCoditionRoutingIsEnabled = true;

        this._appElement = app;
        this._components = [];
        this._detectionTimeout = null;
        this._lastActiveComponents = [];
    }

    public componentCoditionRoutingIsEnabled : boolean;

    private _detectActiveComponent(condition : Function, duration : null|number = null) {
        if (this._detectionTimeout !== null) {
            return;
        }

        this._detectionTimeout = setTimeout(() => {
            let activeComps = [];
            for (let comp of this._components) {
                if (condition(comp)) {
                    activeComps.push(comp);
                }
            }
    
            for (let comp of this._lastActiveComponents) {
                if (!condition(comp)) {
                    comp.dispatchLeave();
                }
            }

            for (let comp of activeComps) {
                // If it is first active Component or it is newly added
                if (this._lastActiveComponents.length <= 0 || this._lastActiveComponents.indexOf(comp) === -1) {
                    comp.dispatchEnter();
                }
            }
    
            this._lastActiveComponents = activeComps;
            clearTimeout(this._detectionTimeout);
            this._detectionTimeout = null;
        }, duration);
    }

    public activateComponentByUrl() {
        this.componentCoditionRoutingIsEnabled = false;
        return this._detectActiveComponent((component: AtomicRoutingComponent) => {
            if (component.props.data.link.url == this.currentUrl) {
                return true;
            }

            this.componentCoditionRoutingIsEnabled = true;
            return false;
         }, 0);
    }

    activateComponentByItsCondition() {
        if (!this.componentCoditionRoutingIsEnabled) {
            return;
        }
        
        return this._detectActiveComponent((component: AtomicRoutingComponent) => { 
            return component.acitveStateCondition() 
        }, 100);
    }

    setupAnchorTagClickHandling() {
        if (!this._appElement) {
            return;
        }
        
        let anchorTags = this._appElement.querySelectorAll('a:not(.reload):not([tarrget=_blank])');
        for (let a of anchorTags) {
            a.addEventListener('click', (e) => {
                let title = a.getAttribute('title');
                if (!title) {
                    title = '';
                }

                if (window.location.pathname !== a.getAttribute('href')) {
                    window.history.pushState({}, title, a.getAttribute('href'));
                }

                this.activateComponentByUrl();

                e.preventDefault();
                return false;
            });
        }

        window.onpopstate = () => {
            this.activateComponentByUrl();
        }
    }

}