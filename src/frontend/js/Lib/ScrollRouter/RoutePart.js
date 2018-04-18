class RoutePart {

	constructor(slug, targetElement, parent, children, index) {
		if (slug instanceof HTMLElement) {
			this._slug = slug.getAttribute('data-route');
			this._target = slug;
		} else {
			this._slug = slug;
			this._target = targetElement;
		}

		this._index = index;
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
    
	get index() {
		return this._index;
	}
	set index(number) {
		if(number){ 
			this._index = number;
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

	get partent() {
		return this._parent;
	}
	set parent(object) {
		if(object instanceof RoutePart){ 
			this._parent = object;
		} else {
			throw new ReferenceError('invalid type parent have to be Route Part');
		}
	}

	get children() {
		return this._children;
	}
	addChild(object) {
		if(object instanceof RoutePart){ 
			this._children[object.slug] = object;
		} else {
			throw new ReferenceError('invalid type parent have to be Route Part');
		}
	}

}

export default RoutePart;