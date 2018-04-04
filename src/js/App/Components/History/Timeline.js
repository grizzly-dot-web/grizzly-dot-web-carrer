import React from 'react';

import check from 'check-types';
import moment from 'moment';

class Timeline extends React.Component {

	constructor(props) {
		super(props);

		//prepare working duration
		let startDate = moment(this.props.currentEntry.begin_date, 'YYYY-MM');
		let endDate = moment(this.props.currentEntry.end_date, 'YYYY-MM');

		if (this.props.currentEntry.end_date === null) {
			endDate = moment();
		}

		let duration = moment.duration(endDate.diff(startDate));
		let timescale = moment.duration(this.props.timescaleStart.diff(this.props.timescaleEnd));

		let scaleFactor = duration / timescale;

		this.state ={
			endDate: endDate,
			startDate: startDate,
			scaleFactor: scaleFactor,
			currentTimeSpanHeight: this.getDefaultHeight(),
		};
	}

	renderLinks(entries, topPosition) {
		let links = [];

		let counter = 0;
		for (let entry of entries) {
			counter++;

			let date = moment(entry.begin_date, 'YYYY-MM');
			let style = {
				top: (topPosition * counter),
				transitionDelay: `${(counter-1)/8}s` ,
			};

			links.push((
				<li key={counter} style={ style }><a href={`#${entry.begin_date}`}>{date.format('MM.YYYY')}</a></li>
			));
		}

		return links;
	}

	render() {

		let prevEntries = this.renderLinks(this.props.prevEntries, window.innerHeight * -1);
		let nextEntries = this.renderLinks(this.props.nextEntries, window.innerHeight);

		let additionalClasses = [];
		if (prevEntries.length > 0) {
			additionalClasses.push('has-prev-entries');
		}
		if (nextEntries.length > 0) {
			additionalClasses.push('has-next-entries');
		}

		return (
			<nav className={`timeline ${additionalClasses.join(' ')}`}>
				<ul className={'inner'}>
					<li>
						<span className={'timespan timespan-previous'}>
							<span className={'current-date-marker begin-marker'}>
								<span className={'date'}><span>{this.state.startDate.format('MM.YYYY')}</span></span>
							</span>
						</span>
						<span className={'timespan timespan-next'}>
							<span className={'current-date-marker end-marker'}>
								<span className={'date'}><span>{this.state.endDate.format('MM.YYYY')}</span></span>
							</span>
						</span>
					</li>
					<ul className={'navigation-previous'}>
						{prevEntries}
					</ul>
					<ul className={'navigation-next'}>
						{nextEntries}
					</ul>
				</ul>
			</nav>
		);
	}

	componentDidMount() {
		this.setState(Object.assign(this.state, {
			currentTimeSpanHeight: this.getScaledHeight(),
		}));
	}

	getDefaultHeight() {
		let height = 40;
		if (this.currentElement && this.currentElement.style.getPropertyValue('--current-time-span-min-height')) {
			height = this.currentElement.style.getPropertyValue('--current-time-span-min-height');
		}

		return height;
	}

	getScaledHeight() {
		const ScaleMax = 40;
		let height = this.getDefaultHeight();

		let scaleFactor = 0;
		if (check.number(this.state.scaleFactor)) {
			scaleFactor = this.state.scaleFactor;
		}

		if (scaleFactor > 1) {
			scaleFactor = 1;
		}

		let dimension = height + (ScaleMax * scaleFactor);

		if (!check.number(dimension)) {
			return 0;
		}

		return dimension;
	}
}

export default Timeline;
