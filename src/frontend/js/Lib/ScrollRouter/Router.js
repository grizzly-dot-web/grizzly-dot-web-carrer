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
		this._routes = this._assignRoutes();
		this.lastDispatchedRoute = null;

		this.dispatchingTimeout = null;
		this._options = Object.assign({
			duration: null, // the duration in milliseconds when durationPerRouteDepth is not defined
			routingBehaviour: null, // function called for each path part when routingBehaviourPerRouteDepth is not defined
			durationPerRouteDepth: [],
			routingBehaviourPerRouteDepth: [],
		}, options);
	}

	dispatch(path) {
		let successfull = true;

		if (this.dispatchingTimeout != null) {
			successfull = false;
		}

		let callback = this.options.routingBehaviourPerRouteDepth[0];
		if (!callback) {
			callback = this.options.routingBehaviour;
		}

		let duration = this.options.durationPerRouteDepth[0];
		if (!duration) {
			duration = this.options.duration;
		}

		let preparedPath = path;
		if (path.charAt(0) == '/') {
			preparedPath = preparedPath.substr(1);
		}
		
		let routeSlugs = preparedPath.split('/');
		if (preparedPath == '' || (routeSlugs.length <= 0 || routeSlugs[0] == '')) {
			return new Promise((resolve, reject) => {
				this.dispatchingTimeout = setTimeout(() => {
					callback(null, '', 0);
					return resolve();
				}, duration);
			});
		}

		let routePart = null;
		return new Promise((resolve, reject) => {
			for (let depth = 0; depth < routeSlugs.length; depth++) {
				let slug = routeSlugs[depth];

				if (this.options.durationPerRouteDepth[depth]) {
					duration = this.options.durationPerRouteDepth[depth];
				}
	
				if (this.options.routingBehaviourPerRouteDepth[depth]) {
					callback = this.options.routingBehaviourPerRouteDepth[depth];
				}
			
				if (routePart === null) {
					routePart = this._routes[slug];
				} else {
					if (routePart.children) {
						routePart = routePart.children[slug];
					}
				}

				if (!(routePart instanceof RoutePart)) {
					throw new Error('404 no matching root');
				}
				
				if (successfull) {
					if (!(this.lastDispatchedRoute instanceof Route)) {
						this.lastDispatchedRoute = new Route();
					}
					
					this.lastDispatchedRoute.addPart(routePart);
				}

				this.dispatchingTimeout = setTimeout(() =>  {
					routePart.dispatch(callback, depth, routeSlugs.length);

					if (depth >= routeSlugs.length -1) {
						clearTimeout(this.dispatchingTimeout);
						this.dispatchingTimeout = null;

						return successfull ? resolve() : reject();
					}
				}, duration);
			}
		});
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

			let childIndex = 0;
			let parentIndex = 0;
			for (let element of elements) {
				
				let parent = element.parentElement;
				while(parent.getAttribute('data-route') === null || parent.getAttribute('data-route').length < 0) {
					parent = parent.parentElement;
				}

				if (!object[parent.getAttribute('data-route')]) {
					object[parent.getAttribute('data-route')] = new RoutePart(parent);
					object[parent.getAttribute('data-route')].index = parentIndex;
				}

				if (!object[parent.getAttribute('data-route')].children[element.getAttribute('data-route')]) {
					object[parent.getAttribute('data-route')].children[element.getAttribute('data-route')] = new RoutePart(element);
					object[parent.getAttribute('data-route')].children[element.getAttribute('data-route')].index = childIndex;
				}
				object[parent.getAttribute('data-route')].children[element.getAttribute('data-route')].parent = object[parent.getAttribute('data-route')];

				if (parent.parent != null) {
					return convertToRouteParts(parent, object);
				}

				childIndex++;
				parentIndex++;
			}

			return object;
		};

		return convertToRouteParts(deppestNestedRoutePartElements);
	}
}

export default Router;