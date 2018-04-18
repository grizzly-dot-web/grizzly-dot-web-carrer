class Route {

	constructor() {
		this._parts = [];
		this._target = null;
		this._pathname = '';
	}
    
	dispatch(callback, depth, calledDepth) {
		callback(this._slug, depth, this._target, calledDepth);        
	}

	get parts() {
		return this._parts;
	}
	set parts(array) {
		if(array){ 
			this._parts = array;
		}
	}
	addPart(string) {
		this._parts.push(string);
	}

	get target() {
		return this.parts[this.parts.length -1].target;
	}
    
	get pathname() {
		return this.parts.join('/');
	}

}

export default Route;