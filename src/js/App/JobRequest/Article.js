import React from 'react';
import check from 'check-types';

import Headings from './Headings';
import Accordeon from './Accordeon';
import Content from './AccessModeratedContent';

class Article extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			data: this.props.data
		};
	}

	render() {
		let accordeons = null;
		if (check.assigned(this.state.data.accordeons)) {
			accordeons = this.renderAccordeons();
		}

		return (
			<article>
				<Headings data={this.state.data.headings} allowedTags={['h1', 'h2', 'h3']} />
				{this.props.children}
				{accordeons}
			</article>
		);
	}

	renderAccordeons() {
		let accordeons = [];

		let counter = 0;
		for (let item of this.state.data.accordeons) {
			counter++;
			accordeons.push((
				<Accordeon key={counter} data={item} allowedTags={['h2', 'h3', 'h4']} onAccordeonHeaderClick={this.handleAccordeonHeaderClick}>
					<Content data={item.content} />
				</Accordeon>
			));
		}

		return accordeons;
	}

	handleAccordeonHeaderClick(e, headings) {

	}
}

export default Article;
