import React from 'react';
import check from 'check-types';
import moment from 'moment';

import FrontendComponent from './Components/FrontendComponent';

import Circle from './Circle';
import Article from './JobRequest/Article';

class HistoryEntry extends FrontendComponent {

	constructor(props) {
		super(props);

		this.state = Object.assign(this.state, {
			lastCirclePosition: 0,
			timescaleEnd: this.props.timescaleEnd,
			timescaleStart: this.props.timescaleStart,
			detailsVisible:  false,
		});
	}

	allowedComponents() {
		return {
			'Article': {
				class: Article,
				props: { allowedTags: ['h3', 'h4', 'h5', 'h6'] }
			}
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
		const CircleScaleMax = 140;
		const CircleDefaultWidth = 50;

		let scaleFactor = duration / timescale;

		// prepare child rendering
		let details = null;
		let detailComponents = this.props.entry.ChildComponents;
		if (check.assigned(detailComponents)) {
			details = (<div className="content">{this.renderComponents(detailComponents)}</div>);
		}

		// render the prepared section
		return (
			<section id={this.props.entry.begin_date} className={'history-entry '+ this.props.additionalClasses.join(' ')}
				style={{ minHeight: CircleDefaultWidth * 2 + CircleScaleMax }}
			>
				<div className="history-content-wrapper">
					<header className="history-header">
						<time className="title">{ this.getFormattedTime(startDate, endDate) }</time>
						<h1><pre>{this.props.entry.institution.title}</pre></h1>
						<h2><pre>{this.props.entry.institution.job_title}</pre></h2>
					</header>
					<div className="history-circle">
						<Circle additionalClasses={['main']} scaleMax={CircleScaleMax} defaultScaleFactor={scaleFactor} defaultWidth={CircleDefaultWidth} >
							<a className="detail-toggle" onClick={(e) => this.onDetailsToggleClick(e)}>Details</a>
						</Circle>
					</div>
					<div className={`history-content
						${check.assigned(details) ? 'details-exists' : ''}
						${this.detailsVisible ? 'details-visible' : ''}`}
					>
						{details}
					</div>
				</div>
				<div className={`experience-circles`}>
					{this.getCircles(this.props.entry.experiences)}
				</div>
			</section>
		);
	}

	onDetailsToggleClick(e) {
		this.setState(Object.assign(this.state, {
			detailsVisible: !this.state.detailsVisible
		}));
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
