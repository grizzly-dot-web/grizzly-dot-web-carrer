import * as React from 'react';

import moment from 'moment';
import * as check from 'check-types';

import Timeline from './Components/History/Timeline';
import HistoryEntry from './Components/History/HistoryEntry';
import AbstractRoutingComponent, { ScrollRoutingComponent } from '../AbstractRoutingComponent';


export interface HistoryProps {
	data : any
}
export interface HistoryState {
	routeName: string
	historyEntries: any
	disableScroll: boolean
	navigationActive : any
	timescaleEnd: moment.Moment
	timescaleStart: moment.Moment
}

class History extends ScrollRoutingComponent<HistoryProps, HistoryState> {

	url: string;

	ref: HTMLElement | null;

	acitveStateCondition(): boolean {
		return false;
	}

	lastScrollTop : number = 0;
	scrollWaitTimeout : number|null = null;
	historyElementRefs : HTMLElement[] = [];

	constructor(props : any) {
		super(props);

		this.lastScrollTop = 0;
		this.scrollWaitTimeout = null;
		this.historyElementRefs = [];

		this.ref = null;
		this.url = '/carrer';
		let entries = this.props.data.sort((a: any, b: any) => {
			let aDate = moment(a.begin_date);
			let bDate = moment(b.begin_date);

			if (aDate < bDate) {
				return -1;
			}

			if (aDate > bDate) {
				return 1;
			}

			return 0;
		});

		this.state = {
			navigationActive: {
				previous: false,
				next: false,
			},
			routeName: 'karriere',
			disableScroll: false,
			historyEntries: entries,
			timescaleEnd: check.assigned(entries[0].end_date) ? moment(entries[0].end_date, 'YYYY-MM') : moment(),
			timescaleStart: moment(entries[entries.length - 1].begin_date, 'YYYY-MM'),
		};
	}

	renderHistoryEntries() {
		let history = [];

		let first = true;
		this.historyElementRefs = [];
		for (let i = 0; i < this.state.historyEntries.length; i++) {
			let classes = [];
			let item = this.state.historyEntries[i];
			let prevEntries = this.state.historyEntries.slice(0, i);
			let nextEntries = this.state.historyEntries.slice(i + 1, this.state.historyEntries.length);

			if (first) {
				classes.push('first-entry');
				first = false;
			}

				history.push(( 
				<HistoryEntry 
					key = { i }
					data = { item }
					prevEntries = { prevEntries }
					nextEntries = { nextEntries }
					additionalClasses = { classes } >
					<Timeline 
						data = { item }
						config = {{}}
						onClickNavigation = { this.handleNavigationClick.bind(this) }
						prevEntries = { prevEntries }
						nextEntries = { nextEntries }
						timescaleStart = { this.state.timescaleStart }
						timescaleEnd = { this.state.timescaleEnd }
					/>  
				</HistoryEntry>
			));
		}

		return history;
	}

	handleNavigationClick(direction: string) {
		let navigationActive = {};

		if (direction == 'previous') {
			navigationActive = {
				previous: !this.state.navigationActive.previous,
				next: false,
			};
		} else {
			navigationActive = {
				previous: false,
				next: !this.state.navigationActive.next,
			};
		}

		this.setState(Object.assign(this.state, {
			navigationActive: navigationActive
		}));
	}

	render() {
		let additionalClasses = [];

		if (this.state.navigationActive.next) {
			additionalClasses.push('navigation-next-active');
		}
		if (this.state.navigationActive.previous) {
			additionalClasses.push('navigation-previous-active');
		}

		return ( 
			<section data-gzly-routing-module={this.state.routeName} className={ `history ${additionalClasses.join(' ')}` }> 
				{ this.renderHistoryEntries() } 
			</section>
		);
	}
}

export default History;
