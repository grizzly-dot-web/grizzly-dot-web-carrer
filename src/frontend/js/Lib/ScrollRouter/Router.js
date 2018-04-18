import RoutePart from'./RoutePart';
import Route from'./Route';

class Router {

	get options() {
		return this._options;
	}
	set options(object) {
		if(object){ 
			Object.assign(this._options, object);
		}
	}

	constructor(options) {
		this._dispatchCalled = false;
		this._startRoute = this._assignRoutes();
		this._currentRoute = null;

		this.dispatchingTimeout = null;
		this._options = Object.assign({
			duration: null, // the duration in milliseconds when durationPerRouteDepth is not defined
			routingBehaviour: null, // function called for each path part when routingBehaviourPerRouteDepth is not defined
			durationPerRouteDepth: [],
			routingBehaviourPerRouteDepth: [],
		}, options);
	}

	getNextRoute() {
		return this._getRouteByRelativeIndex(1);
	}

	getPreviousRoute() {
		return this._getRouteByRelativeIndex(-1);
	}

	_getRouteByRelativeIndex(wantedIndex) {
		return this.workWithCurrentRoute().then(
			(currentRoute) => {
				let depth = currentRoute.parts.length;
				let currentPart = currentRoute.parts[depth -1];

				let routes = this._startRoute.children;
				if (depth > 1 && currentPart.parent) {
					routes = currentPart.parent.children;
				}
			
				let keys = Object.keys(routes);
				let key = currentPart.slug;
				let i = keys.indexOf(key) + wantedIndex;
			
				let destinationRoutePart = undefined;
				if (i !== -1 && keys[i] && routes[keys[i]]) {
					destinationRoutePart = routes[keys[i]];
				}

				if (!(destinationRoutePart instanceof RoutePart)) {
					if (!currentPart.parent || !currentPart.parent.parent) {
						return undefined;
					}

					return this._getRouteByRelativeIndex(wantedIndex, currentPart.parent.parent.children);
				}

				let parts = currentRoute.parts.slice(0, currentRoute.parts.length-1);
				parts.push(destinationRoutePart);

				let routeToDispatch = new Route(parts);

				return routeToDispatch;
			}
		);
	}

	goto(route) {
		let routeToDispatch = route;
		if (!(route instanceof Route)) {
			routeToDispatch = this.getRoutyByPath(route);
		}

		let state = {};
		let title = route.parts[route.parts.length -1].slug;
		let url = routeToDispatch.pathname;

		window.history.replaceState(state, title, url);
		return this.dispatch(routeToDispatch);
	}

	dispatch(route) {
		this._dispatchCalled = true;

		if (!route) {
			throw new Error('no route or path specified');
		}

		let routeToDispatch = route;
		if (!(route instanceof Route)) {
			routeToDispatch = this.getRoutyByPath(route);
		}
		if (route === null) {
			return new Promise((resolve, reject) => {
				this.dispatchingTimeout = setTimeout(() => {
					callback(null, '', 0);
					return resolve();
				}, duration);
			});
		}

		if (this.dispatchingTimeout != null) {
			return new Promise((resolve, reject) => {
				console.log('dispatching in progress');
				return reject();
			});
		}

		let successfull = true;

		let callback = this.options.routingBehaviourPerRouteDepth[0];
		if (!callback) {
			callback = this.options.routingBehaviour;
		}

		let duration = this.options.durationPerRouteDepth[0];
		if (!duration) {
			duration = this.options.duration;
		}

		let routePart = null;
		return new Promise((resolve, reject) => {
			for (let depth = 0; depth < routeToDispatch.parts.length; depth++) {
				routePart = routeToDispatch.parts[depth];
				if (this.options.durationPerRouteDepth[depth]) {
					duration = this.options.durationPerRouteDepth[depth];
				}
	
				if (this.options.routingBehaviourPerRouteDepth[depth]) {
					callback = this.options.routingBehaviourPerRouteDepth[depth];
				}

				if (!(routePart instanceof RoutePart)) {
					throw new Error('404 no matching root');
				}
				
				if (successfull) {
					if (!(this._currentRoute instanceof Route)) {
						this._currentRoute = new Route();
					}
					
					this._currentRoute.addPart(routePart);
				}

				this.dispatchingTimeout = setTimeout(() =>  {
					routePart.dispatch(callback, depth, routeToDispatch.parts.length);

					if (depth >= routeToDispatch.parts.length -1) {
						clearTimeout(this.dispatchingTimeout);
						this.dispatchingTimeout = null;

						return successfull ? resolve() : reject();
					}

					this._currentRoute = routeToDispatch;
				}, duration);
			}
		});
	}

	workWithCurrentRoute() {
		if (this._currentRoute instanceof Route) {
			return new Promise((resolve, reject) => {
				return resolve(this._currentRoute);
			});
		}

		if (this._dispatchCalled !== true) {
			throw new Error('you have to call dispatch once before accessing the current route');
		}

		return new Promise((resolve, reject) => {
			let timeout = null;
			
			while(this._currentRoute != null) {
				if (timeout != null) {
					return resolve(this._currentRoute);
				}
			}
		});
	}

	getRoutyByPath(pathname) {
		let preparedPath = pathname;
		if (pathname.charAt(0) == '/') {
			preparedPath = preparedPath.substr(1);
		}
		if (pathname.charAt(pathname.length -1) == '/') {
			preparedPath = preparedPath.substr(pathname.length -1, 1);
		}
		
		let routeSlugs = preparedPath.split('/');

		let parts = [];
		let routePart = this._startRoute;
		for (let depth = 0; depth < routeSlugs.length; depth++) {
			let slug = routeSlugs[depth];

			if (routePart.slug !== slug && routePart.children) {
				routePart = routePart.children[slug];
			}

			if (!routePart) {
				throw new Error(`404 path did not exist: "${pathname}" could not match: "${slug}"`);
			}

			parts.push(routePart);
		}

		return new Route(parts);
	}

	_assignRoutes() {
		let deepestRouteCount = 10;
		let deppestNestedRoutePartElements = [];

		for(var queryMultiplier = deepestRouteCount; queryMultiplier > 0; queryMultiplier--) {
			let query = Array.apply(null, {length: queryMultiplier}).map(() => { return '[data-route]';}).join(' ');

			for (let element of document.querySelectorAll(query)) {
				// if HTMLElement has no data-route attribute with a value 
				if (element.getAttribute('data-route') === null || element.getAttribute('data-route').length < 0) {
					continue;
				}
		
				if (deppestNestedRoutePartElements.includes(element)) {
					continue;
				}
				
				let childrenOfElementAreInDeepestNested = false;
				for (let childElements of element.children) {
					if (deppestNestedRoutePartElements.includes(childElements)) {
						childrenOfElementAreInDeepestNested = true;
					}
				} 
		
				if (childrenOfElementAreInDeepestNested) {
					continue;
				}

				deppestNestedRoutePartElements.push(element);
			}
		}

		let convertToRouteParts = (elements, object) => {
			if (!object) {
				object = {};
			}
			for (let element of elements) {
				
				let parent = element.parentElement;
				while(parent.getAttribute('data-route') === null || parent.getAttribute('data-route').length < 0) {
					parent = parent.parentElement;
				}

				if (!object[parent.getAttribute('data-route')]) {
					object[parent.getAttribute('data-route')] = new RoutePart(parent);
				}

				if (!object[parent.getAttribute('data-route')].children[element.getAttribute('data-route')]) {
					object[parent.getAttribute('data-route')].children[element.getAttribute('data-route')] = new RoutePart(element);
				}
				object[parent.getAttribute('data-route')].children[element.getAttribute('data-route')].parent = object[parent.getAttribute('data-route')];

				if (parent.parent != null) {
					return convertToRouteParts(parent, object);
				}

			}

			return object;
		};

		return new RoutePart('', document.body, null, convertToRouteParts(deppestNestedRoutePartElements));
	}
}

export default Router;