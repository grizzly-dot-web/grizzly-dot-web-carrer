import React from 'react';
import check from 'check-types';

import FrontendComponent from './../_FrontendComponent';

class Headlines extends FrontendComponent  {

	constructor(props) {
		super(props);

		this.state = Object.assign(this.state, {
			allowedTags: check.array(this.props.allowedTags) ? this.props.allowedTags : ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
		});
	}

	render() {
		let headings = (this.html(this.state.data, this.state.allowedTags));

		if (!this.state.config.isHeader) {
			return headings;
		}
		return (<header>{headings}</header>);
	}

	html(data, headerTags) {
		let
			object,
			headings = []
		;

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

	object(data, headerTags) {
		let headings = {};

		if (!check.array(data) && !check.object(data)) {
			throw new Error(`headings must be an object see { h1: "foo", h2: "bar" } given: ${data}`);
		}

		if (check.object(data)) {
			return data;
		}

		for (let i = 0; i < data.length; i++) {
			let tag = headerTags[i];

			if (i > headerTags.length) {
				tag = headerTags[headerTags.length -1];
				headings[tag] = data[i];

			} else {
				headings[tag] = data[i];
			}

		}

		return headings;
	}

}

export default Headlines;
