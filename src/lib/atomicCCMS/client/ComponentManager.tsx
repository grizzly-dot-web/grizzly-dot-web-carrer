import Router from "../../../Core/Routing/Router";
import CmsRoutingComponent from "../../frontend/ts/Core/Components/Base/ClientSideRoutingComponent";
import User from "../../backend/Core/Component/User/Shared/Models/User";
import ClientSideComponent, { CmsProps, CmsState } from "../../frontend/ts/Core/Components/Base/ClientSideComponent";

export default class ComponentManager {
    static _instance : ComponentManager;
    
    private _user : Promise<User|boolean>|undefined

    get currentUser() {
        if (this._user) {
            return this._user; 
        }

        this._user = new Promise((resolve, reject) => {
            this.fetch('/users/current').then((response) => {
                return response.json().then((data) => {
                    return resolve(data);
                });
            })
        });

        return this._user;
    };

    fetch(route : string, req : RequestInit = {}) {
        let requestInit = {
            ...{ method: 'GET', credentials: 'same-origin' },
            ...req
        }

        return fetch(route, requestInit as RequestInit);
    }

    static getInstance() {
        if (!ComponentManager._instance) {
            ComponentManager._instance = new this();
        }

        return ComponentManager._instance;
    }

    public appElement : HTMLElement|null;

    private _router : Router|null
    private _components : ClientSideComponent<CmsProps<any>, CmsState>[]

    private constructor() {
        this.appElement = null;

        this._router = null;
        this._components = [];
    }


    public init(): any {
        if (!(this.appElement instanceof HTMLElement)) {
            throw new Error('App Element is not assigned')
        }

        this._router = new Router(this.appElement);
    }

    public startRouter() {
        if (!this._router) {
            throw new Error('Router is not assigned')
        }

        this._router.setupAnchorTagClickHandling();
        this._router.activateComponentByUrl();
    }

	public activateComponentByItsCondition(): any {
        if (!this._router) {
            throw new Error('Router is not assigned')
        }

        this._router.activateComponentByItsCondition();
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
    
    public addComponent(comp: any, isRoutingComponent = false) {
        this._components.push(comp);

        if (this._router && isRoutingComponent) {
            this._router.addComponent(comp as CmsRoutingComponent<CmsProps<any>, CmsState>);
        }
    }
}