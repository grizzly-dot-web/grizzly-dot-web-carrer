import * as React from 'react';
import moment from 'moment';

import Experiences from './Entry/Experiences';
import Details from './Entry/Details';
import ClientSideComponent, { ChildComponentConfig, CmsProps, CmsState } from '../../../Core/Components/Base/ClientSideComponent';

export interface Institution {
	begin_date: string,
	end_date?: string,
	type: string
	title: string,
	url: string,
	job_title: string,
	industry: string,
	company_size: string,
}

export interface Experience {
	url: string,
	title: string,
	level: string
	category: string,
	type: string,
}

export interface HistoryEntryData {
	url: string,
	title: string
	childrenInfo: ChildComponentConfig
	institutions: Institution[],
	experiences: Experience[]
}

export interface HistoryEntryProps extends CmsProps<HistoryEntryData> {
}

export interface HistoryEntryState extends CmsState {
	detailsVisible: boolean
	showExperiences: boolean
	experienceBlockingElements: HTMLElement[]
	experiencesOriginPosition: { x : number, y : number }|null
}

class HistoryEntry extends ClientSideComponent<HistoryEntryProps, HistoryEntryState> {
	url: string;

	ref: HTMLElement | null;

	constructor(props : any) {
		super(props);

		this.state = {
			showExperiences: false,
			detailsVisible:  false,
			experienceBlockingElements: [],
			experiencesOriginPosition: null,
		};

		this.ref = null;
		if (this.props.data) {
			this.url = this.props.data.url;
		} else {
			this.url = 'history-entry';
		}
	}

	render() {
		if (!this.props.data) {
			return;
		}

		//prepare working duration
		let startDate = this.stringToDate(this.props.data.institutions[0].begin_date);
		let endDate = this.stringToDate(this.props.data.institutions[this.props.data.institutions.length -1].end_date);


		let classes : string[] = [];
		// render the prepared section
		return (
			<article ref={ (ref) => this.ref = ref} className={`history-entry ${classes.join(' ')}`} >
				<div className={'history-main'}>
					<span className="timespan start">
						<time className="date">{startDate.format('MMMM YYYY')}</time>
					</span>
					<span className="timespan end">
						<time className="date">{endDate.format('MMMM YYYY')}</time>
					</span>
					<header className="history-institutions">
						<div className={'history-header'}>
							<h1 className="history-title">{this.props.data.title}</h1>
						</div>
						{this.renderInstitutions()}
					</header>
					<Experiences data={ this.props.data.experiences } originPosition={this.state.experiencesOriginPosition} show={this.state.showExperiences} blockingElements={this.state.experienceBlockingElements} />
				</div>
				<Details childrenInfo={this.props.data.childrenInfo} />
			</article>
		);
	}

	renderInstitutions() {
		if (!this.props.data) {
			return;
		}

		let counter = 0;
		let rendered = [];
		for (let institution of this.props.data.institutions) {
			counter++;
			//prepare working duration
			let startDate = this.stringToDate(institution.begin_date);
			let endDate = this.stringToDate(institution.end_date);
			
			rendered.push(
				<div key={counter} className={'institution'}>
					<time className="duration">{ this.getFormattedTime(startDate, endDate) }</time>
					<h2 className="institution-title">{institution.title}</h2>
					<span className="institution-subtitle">{institution.job_title}</span>
				</div>
			)
		}
		
		return rendered;
	}

	componentDidMount() {
		let ref = this.ref as HTMLElement;
		let historyHeader = ref.querySelector('.history-header') as HTMLElement;

		this.setState(Object.assign(this.state, {
			experiencesOriginPosition: { x: historyHeader.offsetLeft / 2, y: historyHeader.offsetTop / 2 },
			experienceBlockingElements: [historyHeader]
		}));
	}

	stringToDate(dateString : string|undefined) {
		let date = moment(dateString, 'YYYY-MM');

		if (!dateString) {
			date = moment();
		}

		return date;
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
