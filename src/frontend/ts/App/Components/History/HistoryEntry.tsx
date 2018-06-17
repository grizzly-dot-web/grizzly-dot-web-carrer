import * as React from 'react';
import * as check from 'check-types';
import moment from 'moment';

import {FrontendComponent, FrontendComponentProps} from '../_FrontendComponent';

import Article from '../Content/Article';
import Experience from './Experience';

export interface HistoryEntryProps extends FrontendComponentProps {
	data : any
	prevEntries: any
	nextEntries: any
	entryRef : Function
	additionalClasses: Array<string>
}
class HistoryEntry extends FrontendComponent<HistoryEntryProps> {
	
	constructor(props : any) {
		super(props);

		this.state = Object.assign(this.state, {
			lastPosition: 0,
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

	getExperinces(data : Array<any>) {
		const ScaleMax = 6;
		const DefaultWidth = 2;

		let
			circles = []
		;

		for (let item of this.shuffle(data)) {
			circles.push((
				<Experience key={item.title} additionalClasses={[item.type]} data={item} scaleMax={ScaleMax} defaultWidth={DefaultWidth} lastPosition={this.state.lastPosition} changeLastPosition={(position : number) => this.handleLastExperiencePositionChange(this, position)}>
					<span className="title">{item.title}</span>
				</Experience>
			));
		}

		return circles;
	}

	handleLastExperiencePositionChange(self : HistoryEntry, position: number) {
		self.setState({ lastPosition: position });
	}

	render() {
		//prepare working duration
		let startDate = moment(this.props.data.begin_date, 'YYYY-MM');
		let endDate = moment(this.props.data.end_date, 'YYYY-MM');

		if (this.props.data.end_date === null) {
			endDate = moment();
		}

		// prepare child rendering
		let details = null;
		let detailComponents = this.props.data.ChildComponents;
		if (check.assigned(detailComponents)) {
			details = (<div className="content">{this.renderComponents(detailComponents)}</div>);
		}

		// render the prepared section
		return (
			<article ref={ () => this.props.entryRef} id={this.props.data.begin_date} data-gzly-routing-module={this.props.data.slug} className={'history-entry '+ this.props.additionalClasses.join(' ')}>
				{this.props.children}
				<div className={'history-main'}>
					<header className="history-header">
						<div className={'inner'}>
							<time className="title">{ this.getFormattedTime(startDate, endDate) }</time>
							<h1><pre>{this.props.data.institution.title}</pre></h1>
							<h2><pre>{this.props.data.institution.job_title}</pre></h2>
						</div>
					</header>
					<div className={`experience-circles`}>
						{this.getExperinces(this.props.data.experiences)}
					</div>
				</div>
				<div className={`history-content ${check.assigned(details) ? 'details-exists' : ''} ${this.state.detailsVisible ? 'details-visible' : ''}`} >
					{details}
				</div>
			</article>
		);
	}

	onDetailsToggleClick(e : Event) {
		this.setState(Object.assign(this.state, {
			detailsVisible: !this.state.detailsVisible
		}));
	}

	getFormattedTime(startDate: moment.Moment, endDate : moment.Moment) {
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

		if (years <= 1) {
			formattedYear = years +' '+ singularYear +' ';
		}
		if (months <= 1) {
			formattedMonth = months +' '+ singularMonth +' ';
		}
		if (days <= 1) {
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

export default HistoryEntry;
