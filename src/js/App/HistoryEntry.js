import React from 'react';
import moment from 'moment';

import Circle from './Circle.js';

class HistoryEntry extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			lastCirclePosition: 0,
			timescaleEnd: this.props.timescaleEnd,
			timescaleStart: this.props.timescaleStart,
		};
	}

	getCircles(data) {
		const CircleScaleMax = 6;
		const CircleDefaultWidth = 2;

		let
			circles = []
		;

		for (let item of this.shuffle(data)) {
			circles.push((
				<Circle key={item.title} additionalClasses={['experience', item.type]} data={item} scaleMax={CircleScaleMax} defaultWidth={CircleDefaultWidth} lastCirclePosition={this.state.lastCirclePosition} changeLastCirclePosition={(position) => this.handleLastCirclePositionChange(this, position)}>
					<span className="title">{item.title}</span>
					<span className="type">{' ('+ item.type +')'}</span>
				</Circle>
			));
		}

		return circles;
	}

	handleLastCirclePositionChange(self, position) {
		self.setState({ lastCirclePosition: position });
	}

	render() {
		//prepare working duration
		let startDate = moment(this.props.entry.begin_date, 'YYYY-MM');
		let endDate = moment(this.props.entry.end_date, 'YYYY-MM');

		if (this.props.entry.end_date === null) {
			endDate = moment();
		}

		let duration = moment.duration(endDate.diff(startDate));
		let timescale = moment.duration(this.state.timescaleStart.diff(this.state.timescaleEnd));

		//prepare circles
		const CircleScaleMax = 50;
		const CircleDefaultWidth = 20;

		let scaleFactor = duration / timescale;

		let experienceCircles = this.getCircles(this.props.entry.experiences);
		let halfWayThough = Math.floor(experienceCircles.length / 2);

		let experienceCirclesFirstHalf = experienceCircles.slice(0, halfWayThough);
		let experienceCirclesSecondHalf = experienceCircles.slice(halfWayThough, experienceCircles.length);

		// render the prepared section
		return (
			<section id={this.props.entry.begin_date} className={'history-entry '+ this.props.additionalClasses.join(' ')} style={{ minHeight: CircleDefaultWidth * 2 + CircleScaleMax }}>
				<header>
					<h1>{this.props.entry.institution.title}</h1>
					<h2>{this.props.entry.institution.job_title}</h2>
				</header>
				<div className="flex-container">
					<div className="flex-item flex-grow-2 flex-order-2">
						<Circle additionalClasses={['main']} scaleMax={CircleScaleMax} defaultScaleFactor={scaleFactor} defaultWidth={CircleDefaultWidth} >
							<time className="title">{ this.getFormattedTime(startDate, endDate) }</time>
						</Circle>
					</div>
					<div className="experience-circles flex-item flex-order-1">{experienceCirclesFirstHalf}</div>
					<div className="experience-circles experience-circles-right flex-item flex-order-3">{experienceCirclesSecondHalf}</div>
				</div>
			</section>
		);
	}

	getFormattedTime(startDate, endDate) {
		let years = endDate.diff(startDate, 'years');
		startDate.add(years, 'years');

		let months = endDate.diff(startDate, 'months');
		startDate.add(months, 'months');

		let days = endDate.diff(startDate, 'days');
		startDate.add(days, 'days');

		//Add String Translation
		let pluralYear = 'Jahre';
		let singularYear = 'Jahr';

		let pluralMonth = 'Monate';
		let singularMonth = 'Monat';

		let pluralDay = 'Tage';
		let singularDay = 'Tag';

		let
			formattedYear = years + ' '+ pluralYear +' ',
			formattedMonth = months +' '+ pluralMonth +' ',
			formattedDay = days +' '+ pluralDay
		;

		if (years < 1) {
			formattedYear = years +' '+ singularYear +' ';
		}
		if (months < 1) {
			formattedMonth = months +' '+ singularMonth +' ';
		}
		if (days < 1) {
			formattedDay = days +' '+ singularDay +' ';
		}

		if (years <= 0) {
			formattedYear = '';
		}
		if (months <= 0) {
			formattedMonth = '';
		}
		if (days <= 0) {
			formattedDay = '';
		}

		return formattedYear + formattedMonth + formattedDay;
	}

	// Source: https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
	shuffle(array) {
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

export default HistoryEntry;
