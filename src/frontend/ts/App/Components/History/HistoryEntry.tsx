import * as React from 'react';
import * as check from 'check-types';
import slugify from 'slugify'

import moment from 'moment';

import Article from '../Content/Article';
import Experiences from './Experiences';
import AbstractRoutingComponent, { ScrollRoutingComponent } from '../../../AbstractRoutingComponent';

export interface HistoryEntryProps {
	data : any
	prevEntries: any
	nextEntries: any
	additionalClasses: Array<string>
}

export interface HistoryEntryState {
	lastPosition: number
	detailsVisible: boolean
	showExperiences: boolean
	experienceBlockingElements: HTMLElement[]
	experiencesOriginPosition: { x : number, y : number }|null
}

class HistoryEntry extends ScrollRoutingComponent<HistoryEntryProps, HistoryEntryState> {
	
	url: string;

	ref: HTMLElement | null;

	constructor(props : any) {
		super(props);

		this.state = {
			lastPosition: 0,
			showExperiences: false,
			detailsVisible:  false,
			experienceBlockingElements: [],
			experiencesOriginPosition: null,
		};

		this.ref = null;
		this.url = '/career/'+ slugify(this.props.data.institution.title).toLowerCase() +'-'+ slugify(this.props.data.begin_date).toLowerCase();
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
			details = null; // (<div className="content">{this.renderComponents(detailComponents)}</div>);
		}

		// render the prepared section
		return (
			<article ref={ (ref) => this.ref = ref} id={this.props.data.begin_date} data-gzly-routing-module={this.props.data.slug} className={'history-entry '+ this.props.additionalClasses.join(' ')}>
				{this.props.children}
				<div className={'history-main'}>
					<header className="history-header">
						<div className={'inner'}>
							<time className="title">{ this.getFormattedTime(startDate, endDate) }</time>
							<h1><pre>{this.props.data.institution.title}</pre></h1>
							<h2><pre>{this.props.data.institution.job_title}</pre></h2>
						</div>
					</header>
					<Experiences data={ this.props.data.experiences } originPosition={this.state.experiencesOriginPosition} show={this.state.showExperiences} blockingElements={this.state.experienceBlockingElements} />
				</div>
				<div className={`history-content ${check.assigned(details) ? 'details-exists' : ''} ${this.state.detailsVisible ? 'details-visible' : ''}`} >
					{details}
				</div>
			</article>
		);
	}

	componentDidMount() {
		super.componentDidMount();
		let ref = this.ref as HTMLElement;
		let timeline = document.querySelector('.timeline') as HTMLElement; 
		let historyHeader = ref.querySelector('.history-header') as HTMLElement;

		this.setState(Object.assign(this.state, {
			experiencesOriginPosition: { x: historyHeader.offsetLeft / 2, y: historyHeader.offsetTop / 2 },
			experienceBlockingElements: [timeline, historyHeader]
		}));
	}

	enter(): void {
		super.enter();

		this.setState(Object.assign(this.state, {
			showExperiences: true
		}));
	}
	
	leave(): void {
		super.leave();

		let experienceOverviewLink = document.querySelector('header#page-header .experience-link .circle') as HTMLElement;
		this.setState(Object.assign(this.state, {
			showExperiences: false,
			experiencesOriginPosition: { x: experienceOverviewLink.offsetTop / 2, y: experienceOverviewLink.offsetTop / 2 }
		}));
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
}

export default HistoryEntry;
