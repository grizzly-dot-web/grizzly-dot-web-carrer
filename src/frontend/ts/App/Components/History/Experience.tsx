import * as React from 'react';
import * as check from 'check-types';


export interface ExperienceProps {
	key : any
	data : any
	scaleMax : number
	defaultWidth : number
	defaultScaleFactor? : number
	additionalClasses : Array<string>
	lastPosition : number
	changeLastPosition : Function
}
export interface ExperienceState {
	data : any
	scaleFactor : number
	scaleMax : number
	defaultWidth : number
	circleDimension : number
	additionalClasses : Array<string>
	lastPosition : number
	position : number
}

class Experience extends React.Component<ExperienceProps, ExperienceState> {

	state : any;

	constructor(props : any) {
		super(props);

		let data = check.object(this.props.data) ? this.props.data : null;
		let defaultScaleFactor = check.assigned(this.props.defaultScaleFactor) ? this.props.defaultScaleFactor : null;
		let lastPosition = check.assigned(this.props.lastPosition) ? this.props.lastPosition : 0;

		this.state = {
			data: data,
			scaleFactor: defaultScaleFactor,
			scaleMax: this.props.scaleMax,
			defaultWidth: this.props.defaultWidth,
			circleDimension: null,
			additionalClasses: this.props.additionalClasses,
			lastPosition: lastPosition,
		};

		if (check.function(this.props.changeLastPosition)) {
			this.state.position = this.getPosition(this.state.lastPosition);
			this.props.changeLastPosition(this.state.position);
		}
	}

	render() {
		let defaultScaleFactor = check.number(this.state.scaleFactor) ? this.state.scaleFactor : 0;
		let scaleFactor = (check.object(this.state.data) && check.number(this.state.data.scaleFactor)) ? this.state.data.scaleFactor : defaultScaleFactor;

		if (check.greater(scaleFactor, 1)) {
			scaleFactor = 1;
		}

		let circleDimension = this.getDimension(this.state.defaultWidth, this.state.scaleMax, scaleFactor);

		let styles : any = {
			width: circleDimension + '%',
			paddingTop: circleDimension / 2 + '%',
			paddingBottom: circleDimension / 2 + '%',
		};

		if (this.state.position > 50) {
			styles.marginLeft = circleDimension * -1;
		}

		if (this.state.data != null && check.nonEmptyString(this.state.data.color)) {
			styles.backgroundColor = this.state.data.color;
		}

		styles.left = this.state.position + '%';

		let href = null;
		let target = null;
		let SpecifiedTag = 'span';

		if (this.state.data != null && check.nonEmptyString(this.state.data.url)) {
			href = this.state.data.url;
			target = '_blank';
			SpecifiedTag = 'a';
		}

		return (
			<SpecifiedTag className={`experience ${this.state.additionalClasses.join(' ')}`} href={href} target={target} style={styles}>
				{this.props.children}
			</SpecifiedTag>
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

}

export default Experience;
