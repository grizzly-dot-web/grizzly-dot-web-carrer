import * as React from 'react';

import scroll from 'scroll';
import page from 'scroll-doc';
import ease from 'ease-component';

export class Router {

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

export default abstract class AbstractRoutingComponent<Props = {}, State = {}> extends React.Component<Props, State> {

    protected get _router() : Router {
        return Router.Instance;
    }
    
    abstract get url() : string;

    get appElement() {
        return this._router.appElement as HTMLElement;
    }

    componentDidMount() {
        this._router.addComponent(this);
    }

    dispatchEnter() {       
        this.enter();
    }

    dispatchLeave() {       
        this.leave();
    }

    abstract enter() : void;

    abstract leave() : void;

    abstract acitveStateCondition() : boolean

}

export abstract class ScrollRoutingComponent<Props = {}, State = {}> extends AbstractRoutingComponent<Props, State> {
    

    abstract get ref() : HTMLElement|null
    
    hasScrolledOnce = false

    dispatchEnter() {
        if (this.hasScrolledOnce || this.ref == null)  {
            return;
        }
        
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        let scrollBottom = scrollTop + window.innerHeight;

        this._router.disableActiveDetection = true;
        console.log('scroll-start');
        let callback = () => {
            this._router.disableActiveDetection = false;
            this.hasScrolledOnce = true;
            console.log('scroll-end');        
        }
        scroll.top(page(), this.ref.offsetTop, callback)
           
        this.enter();
    }

    dispatchLeave() {
        this.hasScrolledOnce = false;
        this.leave();
    }

	enter(): void {
        console.log('enter: ', this.url);
	}
	
	leave(): void {
        console.log('leave: ', this.url);
	}

	acitveStateCondition(): boolean {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        let scrollBottom = scrollTop + window.innerHeight;
		if (this.ref == null) {
			return false;
		}

		if (
			scrollBottom >= this.ref.offsetTop &&
			scrollTop <= this.ref.offsetTop + this.ref.clientHeight
		) {
			return true;
        }
		
		return false;
	}
}