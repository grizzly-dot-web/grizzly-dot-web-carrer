import React from 'react';
import moment from 'moment';
import check from 'check-types';

import Navigation from './Navigation';
import HistoryEntry from './HistoryEntry';

class TimeLine extends React.Component {

	constructor(props) {
		super(props);

		let entries = this.props.history.sort((a, b) => {
			let aDate = new Date(a.begin_date);
			let bDate = new Date(b.begin_date);

			if (aDate > bDate) {
				return -1;
			}

			if (aDate < bDate) {
				return 1;
			}

			return 0;
		});

		this.state = {
			historyEntries: entries,
			timescaleStart: check.assigned(entries[0].end_date) ? moment(entries[0].end_date, 'YYYY-MM') : moment(),
			timescaleEnd: moment(entries[entries.length - 1].begin_date, 'YYYY-MM'),
		};
	}

	render() {
		let history = [];

		let dates = [];
		let first = true;

		let counter = 0;
		for (let item of this.state.historyEntries) {
			counter++;
			let classes = [];
			dates.push(item.begin_date);

			if (first) {
				classes.push('first-entry');
				first = false;
			}

			history.push((
				<HistoryEntry key={counter}
					entry={item}
					additionalClasses={classes}
					timescaleStart={this.state.timescaleStart}
					timescaleEnd={this.state.timescaleEnd}
				/>
			));
		}

		return (
			<div className="time-line">
				<Navigation dates={dates} />
				<div className="history">
					{history}
				</div>
			</div>
		);
	}
}

export default TimeLine;
