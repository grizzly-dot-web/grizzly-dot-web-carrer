import * as React from 'react';

import Headlines from './Headlines';
import Accordeon from './Accordeon'; //TODO make Accordeon to dynamic FrontendComponent
import Content from './AccessModeratedContent';

import { FrontendComponent, FrontendComponentProps } from './../_FrontendComponent';

export interface ArticleProps extends FrontendComponentProps {
	allowedTags: Array<string>
}

class Article extends FrontendComponent<ArticleProps> {

	constructor(props : any) {
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
