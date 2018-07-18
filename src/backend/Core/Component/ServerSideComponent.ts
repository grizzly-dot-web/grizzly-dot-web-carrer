import DiContainer from "../DiContainer";
import Router from "../Router";

export default abstract class ServerSideComponent {

    protected abstract name : string;

    private _di : DiContainer;
    private _router : Router;

    routePrefixed() {
        this._router.routePrefix = '/' + this.name;
        return this._router;
    }

    registerPrefixedForDI(identifier : string, classContruct : any, props? : any) {
        this._di.register(this.name + '_'+ identifier, classContruct, props);
    }

    getDependency(identifier : string) {
        return this._di.load(identifier);
    }

    constructor(di : DiContainer, router : Router) {
        this._di = di;
        this._router = router;
    }

    abstract init() : void
}