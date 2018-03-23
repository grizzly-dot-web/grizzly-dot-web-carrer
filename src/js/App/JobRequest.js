import React from 'react';
import check from 'check-types';

import Article from './JobRequest/Article';
import Content from './JobRequest/AccessModeratedContent';

class JobRequest extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			data: this.props.data
		};
	}

	render() {
		return (
			<div className="wrapper">
				<section className="content job-request">
					{this.renderArticles()}
				</section>
			</div>
		);
	}

	renderArticles() {
		let items = [];

		let counter = 0;
		for (let item of this.state.data.articles) {
			counter++;
			let headings = {};
			let headingTags = [
				'h3', 'h4', 'h5'
			];

			for (let i; i <= item.headings.length; i++) {
				headings[headingTags] = item.headings[i];
			}

			let content = null;
			if (check.assigned(item.content)) {
				content = <Content data={item.content} />
			}

			items.push((
				<Article key={counter} data={item} allowedTags={['h1', 'h2', 'h3']} >
					{content}
				</Article>
			));
		}

		return items;
	}

}

export default JobRequest;
