import * as React from 'react';

import CmsControlledComponent, { CmsState, CmsProps } from '../CmsControlledComponent';
import Textarea from './Textarea';
import Headline from './Headline';

export interface ArticleProps extends CmsProps<null> {

}
export interface ArticleState extends CmsState { 

}

class Article extends CmsControlledComponent<ArticleProps, ArticleState> {

	constructor(props : any) {
		super(props);
	}

	render() {
		return (
			<article key={this.props.key}>
				{this.renderChildren({
					'Textarea' : Textarea,
					'Headline' : Headline,
				})}
			</article>
		);
	}

}

export default Article;
