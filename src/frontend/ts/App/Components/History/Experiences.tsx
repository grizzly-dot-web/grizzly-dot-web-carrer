import * as React from 'react';
import * as check from 'check-types';


export interface ExperienceProps {
	data : any
	originCenter : any
	blockedPositions : any
}

export interface ExperienceState {
	data : any
}

class Experiences extends React.Component<ExperienceProps, ExperienceState> {

	state : any;

	constructor(props : any) {
		super(props);

		let data = check.array(this.props.data) ? this.props.data : null;
		this.state = {
			data: data
		};
	}

	render() {
		let experiences = [];

		if (this.state.data == null) {
			return null;
		}

		for (let item of this.shuffle(this.state.data)) {
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
			<div className={`experiences`}>
				{experiences}
			</div>
		);
	}

	getDimension(width : number, scaleMax : number, scaleFactor : number) {
		if (!check.number(scaleFactor)) {
			scaleFactor = 0;
		}

		if (scaleFactor > 1) {
			scaleFactor = 1;
		}

		let dimension = width + (scaleMax * scaleFactor);

		if (!check.number(dimension)) {
			return 0;
		}

		return dimension;
	}

	getPosition(lastPosition : number) {
		let newPosition = lastPosition;
		let forbiddenPositionDifference = 30;

		while (newPosition + forbiddenPositionDifference > lastPosition && newPosition - forbiddenPositionDifference < lastPosition) {
			newPosition =  Math.random() * (100 - 0);
		}

		return newPosition;
	}

	// Source: https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
	shuffle(array: Array<any>) {
		let currentIndex = array.length, temporaryValue, randomIndex;

		// While there remain elements to shuffle...
		while (0 !== currentIndex) {

			// Pick a remaining element...
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;

			// And swap it with the current element.
			temporaryValue = array[currentIndex];
			array[currentIndex] = array[randomIndex];
			array[randomIndex] = temporaryValue;
		}

		return array;
	}

}

export default Experiences;
