import * as React from 'react';
import Content from '../../../../Core/Components/Content';

import Hammer from 'hammerjs';
import ClientSideComponent, { CmsState, CmsProps } from '../../../../Core/Components/Base/ClientSideComponent';

export interface DetailsState extends CmsState {
	isActive : boolean
} 

class Details extends ClientSideComponent<CmsProps<any>, DetailsState> {

	ref : HTMLElement|null = null

	activitionHammer? : HammerManager
	scrollHammer? : HammerManager

	isDragging : boolean = false
	initialPosX : number = 0
	lastPosX : number = 0
	lastTranslateX : number = 0

	constructor(props : any, context: any) {
		super(props, context);

		this.handleActiveStateByDrag = this.handleActiveStateByDrag.bind(this);
		this.handleColumnScrollByDrag = this.handleColumnScrollByDrag.bind(this);
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
					classes: ['columns'],
				} 
			} 
		});

		if (content.length <= 0) {
			return null;
		}

		return (
			<div ref={ref => this.ref = ref} className={`history-details`}>
				<article className="history-details-content column-scroller" onClick={this.activate.bind(this)}>
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
		this.activitionHammer =  new Hammer(article);

		if (!this.state.isActive) {
			this.activitionHammer.on('pan', this.handleActiveStateByDrag)
		}
	}

	handleActiveStateByDrag(hammerEvent : HammerInput) {
		let element = hammerEvent.target;

		if (!this.isDragging) {
			this.isDragging = true;
			this.lastPosX = element.offsetLeft;
		}
		
		element.classList.add('is-dragging')

		let posX = hammerEvent.deltaX + this.lastPosX;
		let greaterThanMax = posX < 0;
		let lowerThanMin = posX > this.initialPosX;

		if (!greaterThanMax && !lowerThanMin) {
			element.style.left = posX + "px";
		}

		if (hammerEvent.isFinal) {
			if (posX < window.innerWidth / 2) {
				this.activate();
			} else {
				this.deactivate();
			}

			element.classList.remove('is-dragging')

			this.isDragging = false;
		}
	}

	handleColumnScrollByDrag(hammerEvent : HammerInput) {
		if (!this.ref) {
			return;
		}
		if (!this.isDragging) {
			this.isDragging = true;
		}

		if (hammerEvent.direction === Hammer.DIRECTION_LEFT) {
			this.lastTranslateX -= 1 * (hammerEvent.distance / 100);
		} else {
			this.lastTranslateX += 1 * (hammerEvent.distance / 100);
		}
		
		if (this.lastTranslateX < -100) {
			this.lastTranslateX = -100;
		}
		if (this.lastTranslateX > 0) {
			this.lastTranslateX = 0;
		}

		let columns = this.ref.querySelector('.columns') as HTMLElement;
		columns.style.transform = `translateX(${this.lastTranslateX}%)`

		if (hammerEvent.isFinal) {
			this.isDragging = false;
		}
	}

	activate(e? : Event) {
		if (!this.ref || this.state.isActive) {
			return;
		}

		this.setState(Object.assign(this.state, {
			isActive: true,
		}));
		
		this.ref.classList.add('is-active');

		if (this.activitionHammer) {
			this.activitionHammer.off('pan', this.handleActiveStateByDrag)
			this.activitionHammer.on('pan', this.handleColumnScrollByDrag)
		}

		console.log('registered');
	}

	deactivate(e? : Event) {
		if (!this.ref || !this.state.isActive) {
			return;
		}

		this.ref.classList.remove('is-active');

		this.setState(Object.assign(this.state, {
			isActive: false,
		}));
		
		if (this.activitionHammer) {
			let columns = this.ref.querySelector('.columns') as HTMLElement;
			columns.style.transform = null;

			this.activitionHammer.on('pan', this.handleActiveStateByDrag)
			this.activitionHammer.off('pan', this.handleColumnScrollByDrag)
		}

		if (e) {
			e.stopPropagation();
		}
	}
}

export default Details;
