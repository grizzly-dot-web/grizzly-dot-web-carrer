import Router from "./Router";
import { NavigationRegistry, NavigationLink } from "./Router/Navigation";
import CmsControlledComponent from "./CmsControlledComponent";
import CmsRoutingComponent from "./Router/AbstractRoutingComponent";

export default class CmsComponentHandler {
    static _instance : CmsComponentHandler;

    static getInstance() {
        if (!CmsComponentHandler._instance) {
            CmsComponentHandler._instance = new this();
        }

        return CmsComponentHandler._instance;
    }

    public appElement : HTMLElement|null;

    private _router : Router|null
    private _components : CmsControlledComponent[]
    private _navigationRegistry : NavigationRegistry;

    private constructor() {
        this.appElement = null;

        this._router = null;
        this._components = [];
        this._navigationRegistry = {};
    }

    init(): any {
        if (!(this.appElement instanceof HTMLElement)) {
            throw new Error('App Element is not assigned')
        }

        this._router = new Router(this.appElement);
    }

    public startRouter() {
        if (!this._router) {
            throw new Error('Router is not assigned')
        }

        this._router.detectActiveComponentByUrl();
        this._router.setupAnchorTagClickHandling();
    }

	public activateComponentByItsCondition(): any {
        if (!this._router) {
            throw new Error('Router is not assigned')
        }

        this._router.detectActiveComponentByItsCondition();
	}

    public disableComponentConditionRouting() {
        if (!this._router) {
            throw new Error('Router is not assigned')
        }

        this._router.componentCoditionRoutingIsEnabled = false;
    }

    public enableComponentConditionRouting() {
        if (!this._router) {
            throw new Error('Router is not assigned')
        }

        this._router.componentCoditionRoutingIsEnabled = true;
    }
    
    public setNavigationRegistry(reg : NavigationRegistry) {
        this._navigationRegistry = reg;
    }
    public addComponent(comp: any, isRoutingComponent = false) {
        this._components.push(comp);

        if (this._router && isRoutingComponent) {
            this._router.addComponent(comp as CmsRoutingComponent);
        }
    }

    public addLinksToNavigation(identifier : string, links : NavigationLink[]) {
        for (let link of links) {
            this.addLinkToNavigation(identifier, link);
        }
    }
    public addLinkToNavigation(identifier : string, link : NavigationLink) {
        if (!this._navigationRegistry.hasOwnProperty(identifier)) {
            throw new Error('Navigation did not exists');
        }

        let links = this._navigationRegistry[identifier].links;
        if (!links) {
            links = [];
        }

        links.push(link);
        this._navigationRegistry[identifier].links = links;

        this.updateNavigationRegistryState(this._navigationRegistry);
    }

    updateNavigationRegistryState(reg : NavigationRegistry) {
        for (let comp of this._components) {
            let state = {};
            if (comp.state) {
                comp.setState(Object.assign(state, {
                    navigationRegistry: reg
                }));
                return;
            }

            comp.state = {
                navigationRegistry: reg
            };
        }
    }

    public renderNavigation(identifier : string, override : Function|null = null) {
        if (!this._navigationRegistry.hasOwnProperty(identifier)) {
            throw new Error('Navigation did not exists');
        }

        let navigation = this._navigationRegistry[identifier];

        if (override) {
            return override(navigation)
        }

        return navigation.render();
    }
}