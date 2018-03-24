import React from 'react';
import check from 'check-types';

import Headings from './Headings';
import Accordeon from './Accordeon';
import Content from './AccessModeratedContent';

class Article extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			config: this.props.config,
			allowedTags: this.props.allowedTags,
		};
	}

	renderComponents() {
		let components = this.state.config.components;
		if (!check.object(this.state.config.components)) {
			return null;
		}

		let render = [], counter = 0;
		for (let key in components) {
			render.push(this.renderComponentByType(key, components[key], counter++));
		}

		return render;
	}

	renderComponentByType(component, config, key) {
		switch (component) {
			case 'Accordeon':
				return null; //(<Content key={key} config={config}  allowedTags={this.state.allowedTags} />);
			case 'Headings':
				return (<Headings key={key} config={config} allowedTags={this.state.allowedTags} />);
			case 'Content':
				return (<Content key={key} config={config} />);
			default:
				throw new Error(`Invalid Component: ${config.type}`);
		}
	}

	render() {
		return (
			<article>
				{this.renderComponents()}
			</article>
		);
	}

}

export default Article;
