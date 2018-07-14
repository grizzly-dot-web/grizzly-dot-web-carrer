import * as React from 'react';
import CmsControlledComponent, { CmsState } from "../../../../Core/CmsControlledComponent";
import CmsMarkdown from '../../../../Core/Components/CmsMarkdown';

import animateCss from '../../../../Helper/animate';

export interface DetailsState extends CmsState {
	isActive : boolean
} 

class Details extends CmsControlledComponent<{}, DetailsState> {

	ref : HTMLElement|null = null

	getInitialState() {
		return {
			isActive: false,
		}
	}
	
	render(): any {
		let content = this.renderChildren({ 
			'CmsMarkdown': { class: CmsMarkdown, props: { allowedHeadlineLevel: 3 } } 
		});

		if (content.length <= 0) {
			return null;
		}

		return (
			<div ref={ref => this.ref = ref} onClick={this.activate.bind(this)} className={`history-details`}>
				<article className="history-details-content">
					{content}
				</article>
			</div>
		);
	}

	activate() {
		if (!this.ref || this.state.isActive) {
			return;
		}

		this.setState(Object.assign(this.state, {
			isActive: true,
		}));

		animateCss(this.ref.querySelector('.history-details-content') as HTMLElement).then(() => {
			let ref = this.ref as HTMLElement;
			ref.classList.toggle('is-active');
		});
	}

	deactivate() {
		if (!this.ref || !this.state.isActive) {
			return;
		}

		this.setState(Object.assign(this.state, {
			isActive: true,
		}));

		animateCss(this.ref.querySelector('.history-details-content') as HTMLElement).then(() => {
			let ref = this.ref as HTMLElement;
			ref.classList.toggle('is-active');
		});
	}
}

export default Details;
