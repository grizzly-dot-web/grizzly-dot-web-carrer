import CmsRoutingComponent from "./Components/Base/ClientSideRoutingComponent";
import { CmsProps, CmsState } from "./Components/Base/ClientSideComponent";

export default class Router {

    private _appElement : HTMLElement|null;
    private _components : CmsRoutingComponent<CmsProps<any>, CmsState>[]
    private _detectionTimeout : any;
    private _lastActiveComponents : CmsRoutingComponent<CmsProps<any>, CmsState>[]

    public get currentUrl() {
        return window.location.pathname;
    }

    public addComponent(component : CmsRoutingComponent<CmsProps<any>, CmsState>) {
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
        return this._detectActiveComponent((component: CmsRoutingComponent<CmsProps<any>, CmsState>) => {
            if (component.link().url == this.currentUrl) {
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
        
        return this._detectActiveComponent((component: CmsRoutingComponent<CmsProps<any>, CmsState>) => { 
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