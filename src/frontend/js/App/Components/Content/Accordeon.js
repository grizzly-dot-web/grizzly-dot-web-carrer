import React from 'react';
import check from 'check-types';

import Headlines from './Headlines';

class Accordeon extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			config: this.props.config,
			allowedTags: this.props.allowedTags,
			contentHeight: 'auto',
			visibleContent: check.boolean(this.props.config.visibleContent) ? this.props.config.visibleContent : false,
		};
	}

	render() {
		return (
			<section className={`accordeon ${(this.state.visibleContent) ? 'accordeon-open' : 'accordeon-closed'}`}>
				<header className="title" onClick={ (e) => { this.toggleContent(); this.props.onAccordeonHeaderClick(e, this.state.config.headings); } }>
					<Headlines config={this.state.config.headings} allowedTags={this.state.allowedTags} />
				</header>
				<div ref={ (accordeonContentElement) => this.accordeonContentElement = accordeonContentElement } className={`accordeon-content`} style={{ height: this.state.contentHeight }}>
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
