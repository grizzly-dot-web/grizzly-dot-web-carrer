import React from 'react';

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
		return (
			<article>
				<Headings data={this.state.data.headings} allowedTags={['h1', 'h2', 'h3']} />
				{this.renderAccordeons()}
			</article>
		);
	}

	renderAccordeons() {
		let accordeons = [];

		for (let item of this.state.data.accordeons) {
			accordeons.push((
				<Accordeon key={item.content} headings={item.headings} allowedTags={['h2', 'h3', 'h4']} onAccordeonHeaderClick={this.handleAccordeonHeaderClick}>
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
