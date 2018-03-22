import React from 'react';
import check from 'check-types';

class Headlines extends React.Component  {

	constructor(props) {
		super(props);

		this.state = {
			data: this.props.data,
			allowedTags: this.props.allowedTags
		};
	}

	render() {
		return (this.html(this.state.data, this.state.allowedTags));
	}

	html(data, headerTags) {
		let
			object,
			headings = []
		;

		object = this.object(data);

		if (check.object(object)) {
			for (let CustomTag in data) {
				let inner = object[CustomTag];
				if (check.object(inner)) {
					inner = this.html(inner);
				}

				headings.push(
					(<CustomTag key={inner}>{inner}</CustomTag>)
				);
			}

			return headings;
		}
	}

	object(data, headerTags) {
		let headings = {};

		if (!check.array(data) && !check.object(data)) {
			throw new Error(`headings must be an object se { h1: "foo", h2: "bar" } given: ${data}`);
		}

		if (check.object(data)) {
			return data;
		}

		for (let i; i <= data.length; i++) {
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
