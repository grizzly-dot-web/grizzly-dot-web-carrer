import React from 'react';

import moment from 'moment';
import check from 'check-types';

import Timeline from './Components/History/Timeline';
import HistoryEntry from './Components/History/HistoryEntry';

class History extends React.Component {

	constructor(props) {
		super(props);
		this.lastScrollTop = 0;
		this.scrollWaitTimeout = null;
		this.historyElementRefs = [];

		let entries = this.props.data.sort((a, b) => {
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

			let assignHistoryElementsReference = (ref) => {
				if (ref == null) {
					return;
				}
			};
			
			history.push(( 
				<HistoryEntry 
					entryRef = { assignHistoryElementsReference }
					key = { i }
					entry = { item }
					prevEntries = { prevEntries }
					nextEntries = { nextEntries }
					additionalClasses = { classes } >
					<Timeline 
						entry = { item }
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

	handleNavigationClick(e, direction) {
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
