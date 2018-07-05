import AbstractRoutingComponent from "./Router/AbstractRoutingComponent";
import { StepTimingFunction } from "csstype";

export default class Router {

    static _instance : Router;

    static getInstance() {
        if (!Router._instance) {
            Router._instance = new this();
        }

        return Router._instance;
    }

    private _detectionTimeout : any;
    private _components : AbstractRoutingComponent<{}, {}>[]
    private _lastActiveComponents : AbstractRoutingComponent[]

    private constructor() {
        this.appElement = null;
        this.disableActiveDetection = false;

        this._detectionTimeout = null;
        this._components = [];
        this._lastActiveComponents = [];
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
        if (this.disableActiveDetection) {
            return;
        }
        
        return this._detectActiveComponent((component: AbstractRoutingComponent) => { 
            return component.acitveStateCondition() 
        }, 100);
    }

    setupAnchorTagClickHandling(anchorSelector : string) {
        if (!this.appElement) {
            return;
        }
        
        let anchorTags = this.appElement.querySelectorAll(anchorSelector);
        anchorTags.forEach((a) => {
            a.addEventListener('click', (e) => {
                window.history.pushState({}, '', a.getAttribute('href'));
                this.detectActiveComponentByUrl();

                e.preventDefault();
                return false;
            });
        });
    }

}