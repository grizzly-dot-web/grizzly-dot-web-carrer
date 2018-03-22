import React from 'react';
import check from 'check-types';

import Headings from './Headings';

class Accordeon extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			headings: this.props.headings,
			allowedTags: this.props.allowedTags,
			contentHeight: 'auto',
			visibleContent: check.boolean(this.props.visibleContent) ? this.props.visibleContent : false,
		};
	}

	render() {
		return (
			<div className="accordeon">
				<header className="title" onClick={ (e) => { this.toggleContent(); this.props.onAccordeonHeaderClick(e, this.state.headings); } }>
					<Headings data={this.state.headings} allowedTags={this.state.allowedTags} />
				</header>
				<div ref={ (accordeonContentElement) => this.accordeonContentElement = accordeonContentElement } className="accordeon-content" style={{ height: this.state.contentHeight }}>
					{this.props.children}
				</div>
			</div>
		);
	}

	componentDidMount() {
		this.originalContentHeight = this.accordeonContentElement.clientHeight;
		this.toggleContent();
	}

	toggleContent(show) {
		let showOrHide = check.boolean(show) ? show : !this.state.visibleContent;

		if (showOrHide) {
			this.setState(Object.assign(this.state, {
				visibleContent: true,
				contentHeight: this.originalContentHeight,
			}));
		} else {
			this.setState(Object.assign(this.state, {
				visibleContent: false,
				contentHeight: 0,
			}));
		}
	}
}

export default Accordeon;
