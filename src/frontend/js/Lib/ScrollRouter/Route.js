class Route {

	constructor(parts) {
		this._parts = parts ? parts : [];
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
		if (!this._target) {
			this._target = this.parts[this.parts.length -1].target;
		}

		return this._target;
	}
    
	get pathname() {
		if (!this._pathnme) {
			let partSlugArray = Object.keys(this.parts).map((key) => {
				return this.parts[key].slug;
			});

			this._pathname =  '/'+ partSlugArray.join('/');
		}

		return this._pathname;
	}

}

export default Route;