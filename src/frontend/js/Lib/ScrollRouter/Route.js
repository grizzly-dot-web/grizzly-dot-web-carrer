import { Module } from './Module';

class Route {

	constructor(modules) {
		this._modules = modules ? modules : [];
	}
    
	dispatch(callback, depth, calledDepth) {
		callback(this._slug, depth, this._target, calledDepth);        
	}

	get modules() {
		return this._modules;
	}
	set modules(array) {
		if(array){ 
			this._modules = array;
		}
	}
	addPart(string) {
		this._modules.push(string);
	}

	get target() {
		if (!this._target) {
			this._target = this.modules[this.modules.length -1].target;
		}

		return this._target;
	}
    
	get pathname() {
		if (!this._pathnme) {
			let moduleSlugArray = this._modules.map((module) => {
				return module.slug;
			});

			this._pathname =  '/'+ moduleSlugArray.join('/');
		}
		
		return this._pathname;
	}

}

export default Route;