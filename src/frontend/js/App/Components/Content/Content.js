import marked from 'marked';
import renderHtml from 'react-render-html';
import check from 'check-types';

import FrontendComponent from './../_FrontendComponent';

class Content extends FrontendComponent {

	constructor(props) {
		super(props);

		this.state = Object.assign(this.state, {
			allowedTags: check.array(this.props.allowedTags) ? this.props.allowedTags : ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
		});
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
		return (renderHtml(marked(content)));
	}
}

export default Content;
