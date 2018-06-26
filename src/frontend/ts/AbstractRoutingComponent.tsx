import * as React from 'react';

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
    }

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
    
                    if (this._lastActiveComponents.findIndex((c) => c.url === comp.url) === -1) {
                        comp.dispatch();
                    }
                }
            }
    
            for (let comp of this._lastActiveComponents) {
                if (!comp.acitveStateCondition()) {
                    comp.leave();
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

    componentDidMount() {
        this._router.addComponent(this);
    }

    dispatch() {        
        this.enter();
    }

    abstract enter() : void;

    abstract leave() : void;

    abstract acitveStateCondition() : boolean

}

export abstract class ScrollRoutingComponent<Props = {}, State = {}> extends AbstractRoutingComponent<Props, State> {
    

	abstract get ref() : HTMLElement|null

	enter(): void {
        console.log('enter: ', this.url);
	}
	
	leave(): void {
        console.log('leave: ', this.url);
	}

	acitveStateCondition(): boolean {
		var scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
	    scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        //scrollLeft += window.innerWidth / 2;
        //scrollTop += window.innerHeight / 2;

		if (this.ref == null) {
			return false;
		}

		if (
			scrollLeft >= this.ref.offsetLeft &&
			scrollLeft <= this.ref.offsetLeft + this.ref.clientWidth &&
			scrollTop >= this.ref.offsetTop &&
			scrollTop <= this.ref.offsetTop + this.ref.clientHeight
		) {
			return true;
        }
		
		return false;
	}
}