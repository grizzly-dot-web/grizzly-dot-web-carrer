import React from 'react';
import marked from 'marked';
import renderHtml from 'react-render-html';
import check from 'check-types';

class Content extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			data: this.props.data
		};
	}

	render() {
		let contentObj = this.state.data;

		if (check.array(contentObj)) {
			let content = [];

			for (let item of contentObj) {
				content.push(this.prepareRender(item));
			}

			return content;
		}

		return this.prepareRender(contentObj);
	}

	prepareRender(item) {
		switch (item.type) {
			case 'markdown':
				return this.convertMarkdown(item.content);
			default:
				throw new Error(`Unhandled Content Type: ${item.type}`);
		}
	}

	convertMarkdown(content) {
		return (
			renderHtml(marked(content))
		);
	}
}

export default Content;
