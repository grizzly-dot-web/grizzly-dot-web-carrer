import * as React from 'react';
import * as check from 'check-types';

import Headlines from './Headlines';

import { FrontendComponent, FrontendComponentProps } from './../_FrontendComponent';

export interface AccordeonProps extends FrontendComponentProps {
	config: any
	allowedTags: any
	onAccordeonHeaderClick: Function
}
export interface AccordeonState {
	config?: any
	allowedTags?: any
	contentHeight?: string
	visibleContent?: boolean
	originalContentHeight?: number
}

class Accordeon extends React.Component<AccordeonProps, AccordeonState> {

	originalContentHeight : number

	accordeonContentElement : HTMLElement

	constructor(props : any) {
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

	toggleContent(show : boolean = null) {
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
