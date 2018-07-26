import express from 'express';

export interface RequestHandler {
    // tslint:disable-next-line callable-types (This is extended from and can't extend from a type alias in ts<2.2
    (req: express.Request, res: express.Response, next: express.NextFunction): any;
}

export default class Router {
	
	private _app :  express.Router

	private _routes : { [scope:string] : {[requestMethod:string] : {[route:string] : RequestHandler}} }

	public routePrefix : string = '';

	constructor(app : express.Router) {
		this._app = app;
		this._routes = {
		};
	}

	private _register(requestMethod : string, route : string, handlers : RequestHandler, scope : string = 'default') {
		route = this.routePrefix + route

        if (this._routes[scope] === undefined) {
			this._routes[scope] = {};
		}
		
        if (this._routes[scope][requestMethod] === undefined) {
			if (['get', 'post', 'put', 'delete'].indexOf(requestMethod) === -1) {
				throw new Error(`Invalid Request Method ${requestMethod}`);
			}
			this._routes[scope][requestMethod] = {};
		}
		
        if (this._routes[scope][requestMethod][route] !== undefined) {
            throw new Error(`Route already Exists ${route} with ${requestMethod}`);
        }

		this._routes[scope][requestMethod][route] = handlers;
		this.routePrefix = '';
	}

	get(route : string, handlers : RequestHandler, scope? : string) {
		this._register('get', route, handlers, scope);
	}

	post(route : string, handlers : RequestHandler, scope? : string) {
		this._register('post', route, handlers, scope);
	}

	update(route : string, handlers : RequestHandler, scope? : string) {
		this._register('update', route, handlers, scope);
	}

	delete(route : string, handlers : RequestHandler, scope? : string) {
		this._register('delete', route, handlers, scope);
	}

	listen() {
		for (let scope in this._routes) {
			for (let method in this._routes[scope]) {
				for (let route in this._routes[scope][method]) {
					switch(method) {
						case 'get':
							this._app.get(route, this._routes[scope][method][route]);
						break;
	
						case 'post':
							this._app.post(route, this._routes[scope][method][route]);
						break;
	
						case 'put':
							this._app.put(route, this._routes[scope][method][route]);
						break;
	
						case 'delete':
							this._app.delete(route, this._routes[scope][method][route]);
						break;
					}
				}
			}
		}
	}

}

