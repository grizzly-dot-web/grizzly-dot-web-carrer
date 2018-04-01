import React from 'react';

import FrontendComponent from './../Components/FrontendComponent';

import Headlines from './Headlines';
import Accordeon from './Accordeon'; //TODO make Accordeon to dynamic FrontendComponent
import Content from './AccessModeratedContent';

class Article extends FrontendComponent {

	constructor(props) {
		super(props);

		this.state = Object.assign(this.state, {
			allowedTags: this.props.allowedTags,
		});
	}

	allowedComponents() {
		return {
			'Headings': {
				class: Headlines,
				props: { allowedTags: this.state.allowedTags },
			},
			'Content': {
				class: Content,
			}
		};
	}

	render() {
		return (
			<article>
				{this.renderComponents(this.state.data.ChildComponents)}
			</article>
		);
	}

}

export default Article;
