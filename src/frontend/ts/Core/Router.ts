import AbstractRoutingComponent from "./Router/AbstractRoutingComponent";

export default class Router {

    static _instance : Router;

    static get Instance() {
        if (!Router._instance) {
            Router._instance = new this();
        }

        return Router._instance;
    }

    private _detectionTimeout : any;
    private _components : AbstractRoutingComponent<{}, {}>[]
    private _lastActiveComponents : AbstractRoutingComponent[]

    private constructor() {
        this._detectionTimeout = null;
        this._components = [];
        this._lastActiveComponents = [];
        this.disableActiveDetection = false;
        this.appElement = null;
    }

    public appElement : HTMLElement|null;
    public disableActiveDetection : boolean;

    public get currentUrl() {
        return window.location.pathname;
    }

    public addComponent(comp: any) {
        this._components.push(comp);
    }

    protected _detectActiveComponent(condition : Function, duration : null|number = null) {
        if (this._detectionTimeout !== null || this.disableActiveDetection) {
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
                if (!comp.acitveStateCondition()) {
                    comp.dispatchLeave();
                }
            }

            for (let comp of activeComps) {
                if (this._lastActiveComponents.findIndex((c) => c.url === comp.url) === -1) {
                    comp.dispatchEnter();
                }
            }
    
            this._lastActiveComponents = activeComps;
            clearTimeout(this._detectionTimeout);
            this._detectionTimeout = null;
        }, duration);
    }

    public detectActiveComponentByUrl() {
        return this._detectActiveComponent((component: AbstractRoutingComponent) => {
            if (component.url === this.currentUrl) {
                return true;
            }

            return false;
         }, 0);
    }

    detectActiveComponentByItsCondition() {
        return this._detectActiveComponent((component: AbstractRoutingComponent) => { 
            return component.acitveStateCondition() 
        }, 100);
    }

}