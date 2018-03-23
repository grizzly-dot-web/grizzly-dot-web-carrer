import React from 'react';
import check from 'check-types';

import Headings from './Headings';

class Accordeon extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			data: this.props.data,
			allowedTags: this.props.allowedTags,
			contentHeight: 'auto',
			visibleContent: check.boolean(this.props.data.visibleContent) ? this.props.data.visibleContent : false,
		};
	}

	render() {
		return (
			<section className={`accordeon ${(this.state.visibleContent) ? 'accordeon-open' : 'accordeon-closed'}`}>
				<header className="title" onClick={ (e) => { this.toggleContent(); this.props.onAccordeonHeaderClick(e, this.state.data.headings); } }>
					<Headings data={this.state.data.headings} allowedTags={this.state.allowedTags} />
				</header>
				<div ref={ (accordeonContentElement) => this.accordeonContentElement = accordeonContentElement } className={`accordeon-content`} style={{ height: this.state.contentHeight }}>
					{this.props.children}
				</div>
			</section>
		);
	}

	componentDidMount() {
		this.originalContentHeight = this.accordeonContentElement.clientHeight;
		this.toggleContent(this.state.visibleContent);
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
