export default class DiContainer {

    private _dependencies : { [identifier:string] : { class : any, props? : any[], instance? : any} } 

	constructor() {
        this._dependencies = {};
	}

	register<T>(identifier : string, classConstruct : any, props? : any[]) {
        if (this._dependencies[identifier]) {
            throw new Error('Already registered Dependency, maybe forget to register');
        }

        this._dependencies[identifier] = {
            class: classConstruct,
            props: props,
        }
	}

	load<T>(identifier : string) : T {
        if (!this._dependencies[identifier]) {
            throw new Error('Missing Dependency, maybe forget to register');
        }

        let dependency = this._dependencies[identifier].instance;
        if (!dependency) {
            let classConstruct = this._dependencies[identifier].class as { new(props?:any): any }; 
            let constructionProps = this._dependencies[identifier].props || [];
            
            dependency = new classConstruct(...constructionProps);
            this._dependencies[identifier].instance = dependency;
        }

        return this._dependencies[identifier].instance;
	}

}