import express from 'express';

export interface RequestHandler {
    // tslint:disable-next-line callable-types (This is extended from and can't extend from a type alias in ts<2.2
    (req: express.Request, res: express.Response, next: express.NextFunction): any;
}

export default class Router {
	
	private _app :  express.Router

	private _routes : { [requestMethod:string] : {[route:string] : RequestHandler} }

	public routePrefix : string = '';

	constructor(app : express.Router) {
		this._app = app;
		this._routes = {
			get: {},
			post: {},
			delete: {},
			update: {},
		};
	}

	private _register(requestMethod : string, route : string, handlers : RequestHandler) {
		route = this.routePrefix + route

        if (this._routes[requestMethod] === undefined) {
            throw new Error(`Invalid Request Method ${requestMethod}`);
		}
		
        if (this._routes[requestMethod][route] !== undefined) {
            throw new Error(`Route already Exists ${route} with ${requestMethod}`);
        }

		this._routes[requestMethod][route] = handlers;
		this.routePrefix = '';
	}

	get(route : string, handlers : RequestHandler) {
		this._register('get', route, handlers);
	}

	post(route : string, handlers : RequestHandler) {
		this._register('post', route, handlers);
	}

	update(route : string, handlers : RequestHandler) {
		this._register('update', route, handlers);
	}

	delete(route : string, handlers : RequestHandler) {
		this._register('delete', route, handlers);
	}

	listen() {
		for (let method in this._routes) {
			for (let route in this._routes[method]) {
				switch(method) {
					case 'get':
						this._app.get(route, this._routes[method][route]);
					break;

					case 'post':
						this._app.post(route, this._routes[method][route]);
					break;

					case 'put':
						this._app.put(route, this._routes[method][route]);
					break;

					case 'delete':
						this._app.delete(route, this._routes[method][route]);
					break;

				}
			}
		}
	}

}

