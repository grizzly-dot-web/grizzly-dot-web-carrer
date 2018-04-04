import React from 'react';
import moment from 'moment';
import check from 'check-types';

import Timeline from './Components/History/TimeLine';
import HistoryEntry from './Components/History/HistoryEntry';

class History extends React.Component {

	constructor(props) {
		super(props);

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
			historyEntries: entries,
			navigationActive: false,
			timescaleEnd: check.assigned(entries[0].end_date) ? moment(entries[0].end_date, 'YYYY-MM') : moment(),
			timescaleStart: moment(entries[entries.length - 1].begin_date, 'YYYY-MM'),
		};
	}

	renderHistoryEntries() {
		let history = [];

		let first = true;
		for (let i = 0; i < this.state.historyEntries.length; i++) {
			let classes = [];
			let item = this.state.historyEntries[i];
			let prevEntries = this.state.historyEntries.slice(0, i);
			let nextEntries = this.state.historyEntries.slice(i+1, this.state.historyEntries.length);

			if (first) {
				classes.push('first-entry');
				first = false;
			}

			history.push((
				<HistoryEntry
					key={i}
					entry={item}
					prevEntries={prevEntries}
					nextEntries={nextEntries}
					additionalClasses={classes}
				>
					<Timeline
						prevEntries={prevEntries}
						nextEntries={nextEntries}
						currentEntry={item}
						timescaleStart={this.state.timescaleStart}
						timescaleEnd={this.state.timescaleEnd}
					/>
				</HistoryEntry>
			));
		}

		return history;
	}

	render() {
		let additionalClasses = [];
		if (this.state.navigationActive) {
			additionalClasses.push('navigation-next-active');

			let delay = setTimeout(()=> {
				additionalClasses.push('navigation-show');

				clearTimeout(delay);
			}, 500);
		}

		return (
			<section className={`history ${additionalClasses.join(' ')}`}>
				{this.renderHistoryEntries()}
			</section>
		);
	}

	componentDidMount() {
		setTimeout(() => {
			this.setState(Object.assign(this.state, {
				navigationActive: true,
			}));
		}, 1000);
	}
}

export default History;
