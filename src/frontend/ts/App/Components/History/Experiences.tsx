import * as React from 'react';
import * as check from 'check-types';

import PositioningHelper from '../../Helper/PositioningHelper';
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

	experienceRefs : HTMLElement[];
	
	experienceRefContainer : HTMLElement|null;

	constructor(props : any) {
		super(props);

		this.experienceRefs = [];
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
	
			experiences.push((
				<SpecifiedTag key={item.title} className={`experience ${item.type}`} href={href} target={target}>
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
	
	componentDidMount() {
		this.rearrangeRenderedExperiences();
	}

	rearrangeRenderedExperiences() {
		let blockedOffsets = [];
		
		let timeline = document.querySelector('.timeline') as HTMLElement; 
		let header = document.querySelector('.history-header') as HTMLElement;
		let experiences = document.querySelectorAll('.experiences .experience');

		let center = {
			top: header.scrollTop + (header.clientHeight / 2),
			left: header.scrollLeft + (header.clientWidth / 2),
		};

		blockedOffsets.push(timeline)
		blockedOffsets.push(header)

		let positioningHelper = new PositioningHelper(this.experienceRefContainer as HTMLElement, blockedOffsets)
		for (let element of experiences) {
			let ref = element as HTMLElement;

			ref.classList.remove('is-positioned')
			let position = positioningHelper.positionElement(ref);

			if (position.left + (ref.clientWidth / 2) < center.left) {
				ref.classList.add('experience__align-left');
			} else {
				ref.classList.add('experience__align-right');
			}

			if (position.top + (ref.clientHeight / 2) < center.top) {
				ref.classList.add('experience__align-top');
			} else {
				ref.classList.add('experience__align-bottom');
			}

			let pointer = ref.querySelector('.appereance-pointer') as HTMLElement;

			pointer.style.translate = `rotate(${calcAngle(position, center)}deg)`;
			ref.classList.add('is-positioned')
		}
		positioningHelper.debug();
	}

}

export default Experiences;
