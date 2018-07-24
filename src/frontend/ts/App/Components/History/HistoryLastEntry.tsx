import * as React from 'react';

import HistoryEntry from './HistoryEntry';
import Experiences from './Entry/Experiences';
import Details from './Entry/Details';

export default class HistoryLastEntry extends HistoryEntry  {
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

		let renderedTitle = null;
		if (this.props.data.title) {
			renderedTitle = (
				<div className={'history-header'}>
					<h2 className="h1 history-title">{this.props.data.title}</h2>
				</div>
			)
		}



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
						{renderedTitle}
						{this.renderInstitutions()}
					</header>
					<Experiences data={ this.props.data.experiences } originPosition={this.state.experiencesOriginPosition} show={this.state.showExperiences} blockingElements={this.state.experienceBlockingElements} />
				</div>
				<Details enableScrollHandling={false} data={this.props.data} />
			</article>
		);
	}
}