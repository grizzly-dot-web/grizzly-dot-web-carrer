class Module {

	constructor(slug, targetElement, parent, children) {
		if (slug instanceof HTMLElement) {
			this._slug = slug.getAttribute('data-gzly-routing-module');
			this._target = slug;
		} else {
			this._slug = slug;
			this._target = targetElement;
		}

		this._parent = parent ? parent : null;
		this._children = children ? children : {};
	}
    
	dispatch(callback, depth, calledDepth) {
		if (!callback) {
			throw new Error('No callback specified in options');
		}
        
		callback(this._slug, depth, this._target, calledDepth);        
	}
    
	get slug() {
		return this._slug;
	}
	set slug(string) {
		if(string){ 
			this._slug = string;
		}
	}

	get target() {
		return this._target;
	}
	set target(element) {
		if(element){ 
			this._target = element;
		}
	}

	get parent() {
		return this._parent;
	}
	set parent(object) {
		if(object instanceof Module){ 
			this._parent = object;
		} else {
			throw new ReferenceError('invalid type parent have to be Route Part');
		}
	}

	get children() {
		return this._children;
	}
	addChild(object) {
		if(object instanceof Module){ 
			this._children[object.slug] = object;
		} else {
			throw new ReferenceError('invalid type parent have to be Route Part');
		}
	}

}

export default Module;