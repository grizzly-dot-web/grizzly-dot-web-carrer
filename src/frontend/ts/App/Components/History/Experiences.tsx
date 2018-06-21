import * as React from 'react';
import * as check from 'check-types';

import { RandomPackager } from '../../Helper/PositioningHelper';
import { calcAngle } from '../../Helper/AngleCalculation';

export interface ExperienceProps {
	data : any
	originCenter : any
	blockedPositions : any
}

export interface ExperienceState {
	data : any
	blockingElements : HTMLElement[]
}

class Experiences extends React.Component<ExperienceProps, ExperienceState> {

	state : any;
	
	experienceRefContainer : HTMLElement|null;

	constructor(props : any) {
		super(props);

		this.experienceRefContainer = null;
		this.state = {
			data: this.props.data,
			blockingElements: this.props.blockedPositions  
		};
	}

	render() {
		let experiences = [];

		if (check.array(this.state.data) == null) {
			return null;
		}

		for (let item of this.state.data) {
			let href = null;
			let target = null;
			let SpecifiedTag = 'span';
	
			if (item != null && check.nonEmptyString(item.url)) {
				href = item.url;
				target = '_blank';
				SpecifiedTag = 'a';
			}
	
			let style = {
				transform: `scale(${item.scaleFactor / 5 + 1})`
			}

			experiences.push((
				<SpecifiedTag key={item.title} className={`experience ${item.type}`} href={href} target={target} style={style}>
					<span className="title">{item.title}</span>
					<span className="appereance-pointer" aria-hidden></span>
				</SpecifiedTag>
			));
		}

		return (
			<div ref={ (ref) => this.experienceRefContainer = ref } className={`experiences`}>
				{experiences}
			</div>
		);
	}
	
	componentDidUpdate() {
		this.rearrangeExperiences();
	}

	rearrangeExperiences() {
		let blockingElements = [];

		let container = this.experienceRefContainer as HTMLElement;
		let timeline = document.querySelector('.timeline') as HTMLElement; 
		let header = document.querySelector('.history-header') as HTMLElement;
		let experiences = container.querySelectorAll('.experiences .experience');

		let center = {
			x: header.offsetLeft + (header.clientWidth / 2),
			y: header.offsetTop + (header.clientHeight / 2),
		};

		blockingElements.push(timeline)
		blockingElements.push(header)

		let packager = new RandomPackager(container as HTMLElement, {
			blockingElements: blockingElements
		});

		for (let element of experiences) {
			let item = packager.addItem(element as HTMLElement);			

			if (item.left + (item.originElement.clientWidth / 2) < center.x) {
				item.originElement.classList.add('experience__align-left');
			} else {
				item.originElement.classList.add('experience__align-right');
			}

			if (item.top + (item.originElement.clientHeight / 2) < center.y) {
				item.originElement.classList.add('experience__align-top');
			} else {
				item.originElement.classList.add('experience__align-bottom');
			}
		}

		packager.layout()
	}

}

export default Experiences;