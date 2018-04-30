import * as React from 'react';
import marked from 'marked';
import check from 'check-types';

import { FrontendComponent, FrontendComponentProps } from './../_FrontendComponent';

export interface ContentProps extends FrontendComponentProps {
	allowedTags: Array<string>
}

class Content extends FrontendComponent<ContentProps> {

	constructor(props : any) {
		super(props);

		this.state = Object.assign(this.state, {
			allowedTags: check.array(this.props.allowedTags) ? this.props.allowedTags : ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
		});
	}

	allowedComponents() {
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

	prepareRender(item : any) {
		switch (item.type) {
			case 'markdown':
				return this.convertMarkdown(item.content);
			default:
				throw new Error(`Unhandled Content Type: ${item.type}`);
		}
	}

	convertMarkdown(content : any) {
		return (<div dangerouslySetInnerHTML={{__html: marked(content)}}></div>);
	}
}

export default Content;
