import React from 'react'
import check from 'check-types'

class Circle extends React.Component {

	constructor(props) {
		super(props);

		let data = check.object(this.props.data) ? this.props.data : null;
		let defaultScaleFactor = !check.maybe(this.props.defaultScaleFactor) ? this.props.defaultScaleFactor : null;
		let lastCirclePosition = !check.maybe(this.props.lastCirclePosition) ? this.props.lastCirclePosition : 0;

		this.state = {
			data: data,
			scaleFactor: defaultScaleFactor,
			scaleMax: this.props.scaleMax,
			defaultRadius: this.props.defaultRadius,
			circleDimension: null,
			additionalClasses: this.props.additionalClasses,
			lastCirclePosition: lastCirclePosition,
		};

		if (check.function(this.props.changeLastCirclePosition)) {
				this.state.position = this.getCirclePosition(this.state.lastCirclePosition);
				this.props.changeLastCirclePosition(this.state.position);
		}
	}

	render() {
		let defaultScaleFactor = check.number(this.state.scaleFactor) ? this.state.scaleFactor : 0;
		let scaleFactor = (check.object(this.state.data) && check.number(this.state.data.scaleFactor)) ? this.state.data.scaleFactor : 0;

		if (check.greater(scaleFactor, 1)) {
			scaleFactor = 1;
		}

		this.state.circleDimension = this.getCircleDimension(this.state.defaultRadius, this.state.scaleMax, scaleFactor);

		let styles = {
			position: 'relative',
			width: this.state.circleDimension + 'px',
			height:	this.state.circleDimension + 'px',
		};

		if (this.state.position > 50) {
			styles.marginLeft = this.state.circleDimension * -1
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
			<SpecifiedTag className={"circle "+ this.state.additionalClasses.join(" ")} href={href} target={target} style={styles}>
				{this.props.children}
			</SpecifiedTag>
		);
	}

	getCircleDimension(radius, scaleMax, scaleFactor) {
			if (!check.number(scaleFactor)) {
				scaleFactor = 0;
			}

			if (scaleFactor > 1) {
				scaleFactor = 1;
			}

			let dimension = (radius * 2) + scaleMax * scaleFactor;

			if (!check.number(dimension)) {
				return 0;
			}

			return dimension;
	}

	getCirclePosition(lastPosition, circleWidth) {
		let newPosition = lastPosition;
		let forbiddenPositionDifference = 30;

		while (newPosition + forbiddenPositionDifference > lastPosition && newPosition - forbiddenPositionDifference < lastPosition) {
			newPosition =  Math.random() * (100 - 0);
		}

		return newPosition;
	}

}

export default Circle;
