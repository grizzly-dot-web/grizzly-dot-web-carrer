import React from 'react';

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

		for (let item of this.state.data.articles) {
			let headings = {};
			let headingTags = [
				'h3', 'h4', 'h5'
			];

			for (let i; i <= item.headings.length; i++) {
				headings[headingTags] = item.headings[i];
			}

			items.push((
				<Article key={item.content} data={item} headings={headings} >
					<Content data={item.content} />
				</Article>
			));
		}

		return items;
	}

}

export default JobRequest;
