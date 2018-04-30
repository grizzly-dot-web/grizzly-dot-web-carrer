import * as React from 'react';
import * as check from 'check-types';

import {FrontendComponent, FrontendComponentProps} from './../_FrontendComponent';

export interface HeadlinesProps extends FrontendComponentProps {
	config: any
	allowedTags: Array<string>
}

class Headlines extends FrontendComponent<HeadlinesProps>  {

	constructor(props : any) {
		super(props);

		this.state = Object.assign(this.state, {
			allowedTags: check.array(this.props.allowedTags) ? this.props.allowedTags : ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
		});
	}

	allowedComponents() {

	}

	render() {
		let headings = (this.html(this.state.data, this.state.allowedTags));

		if (!this.state.config.isHeader) {
			return headings;
		}
		return (<header>{headings}</header>);
	}

	html(data : any, headerTags : Array<string>) : any {
		let object : {[tag: string]: string|HTMLElement};
		let headings = [];

		object = this.object(data, headerTags);
		if (check.object(object)) {
			let counter = 0;
			for (let CustomTag in object) {
				let inner = object[CustomTag];
				if (check.object(inner)) {
					inner = this.html(inner, headerTags);
				}

				headings.push(
					(<CustomTag key={counter++}>{inner}</CustomTag>)
				);
			}

			return headings;
		}
	}

	object(data : Array<any>, headerTags : Array<string>) : any {
		let headings : any = {};

		if (!check.array(data) && !check.object(data)) {
			throw new Error(`headings must be an object see { h1: "foo", h2: "bar" } given: ${data}`);
		}

		if (check.object(data)) {
			return data;
		}

		let array : Array<any> = data;
		for (let i = 0; i < array.length; i++) {
			let tag = headerTags[i];

			if (i > headerTags.length) {
				tag = headerTags[headerTags.length -1];
				headings[tag] = array[i];

			} else {
				headings[tag] = array[i];
			}

		}

		return headings;
	}

}

export default Headlines;
