import * as React from 'react';
import Content from '../../../../Core/Components/Content';

import ClientSideComponent, { CmsState, CmsProps } from '../../../../Core/Components/Base/ClientSideComponent';

export interface DetailsProps extends CmsProps<any> {
} 
export interface DetailsState extends CmsState {
	isActive : boolean
} 

class Details extends ClientSideComponent<DetailsProps, DetailsState> {

	ref : HTMLElement|null = null

	isDragging : boolean = false
	initialPosX : number = 0
	lastPosX : number = 0
	lastTranslateX : number = 0

	constructor(props : any, context: any) {
		super(props, context);
	}

	getInitialState() {
		return {
			isActive: false,
		}
	}
	
	render(): any {
		let content = this.renderChildren({ 
			'Content': { 
				class: Content, props: { 
					allowedHeadlineLevel: 3, 
					classes: ['textarea'],
				} 
			} 
		});

		if (content.length <= 0) {
			return null;
		}

		return (
			<div ref={ref => this.ref = ref} className={`history-details`}>
				<article className="history-details-content" onClick={this.activate.bind(this)}>
					<button onClick={this.deactivate.bind(this)} className="close">Schließen</button>
					{content}
				</article>
			</div>
		);
	}

	componentDidMount() {
		if (!this.ref) {
			return;
		}

		let article = this.ref.querySelector('.history-details-content') as HTMLElement;
		this.initialPosX = article.offsetLeft;
	}

	activate(e? : Event) {
		if (!this.ref || this.state.isActive) {
			return;
		}

		this.setState(Object.assign(this.state, {
			isActive: true,
		}));
		
		this.ref.classList.add('is-active');
	}

	deactivate(e? : Event) {
		if (!this.ref || !this.state.isActive) {
			return;
		}

		this.ref.classList.remove('is-active');

		this.setState(Object.assign(this.state, {
			isActive: false,
		}));

		if (e) {
			e.stopPropagation();
		}
	}
}

export default Details;
