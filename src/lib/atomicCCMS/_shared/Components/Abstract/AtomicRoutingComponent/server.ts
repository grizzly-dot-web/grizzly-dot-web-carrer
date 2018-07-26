import { Request, Response, NextFunction } from 'express';
import DiContainer from '../../../../server/DiContainer';
import Router from '../../../../server/Router';

export default abstract class AtomicComponent {

    protected abstract get name() : string;

    private _di : DiContainer;

    private _router : Router;

    constructor(di : DiContainer, router : Router) {
        this._di = di;
        this._router = router;

        this.registerRoutes();
    }

    registerRoutes() {
        this._router.get('*', (req : Request, res : Response, next : NextFunction) => {
            this.index(req, res, next);
            next();
        }, this.name);
    }

    routePrefixed() {
        this._router.routePrefix = '/' + this.name;
        return this._router;
    }

    abstract index(req : Request, res : Response, next : NextFunction) : void;

    registerPrefixedForDI(identifier : string, classContruct : any, props? : any) {
        this._di.register(this.name + '_'+ identifier, classContruct, props);
    }

    getDependency<T>(identifier : string) : T {
        return this._di.load<T>(identifier);
    }

    abstract init() : void
}