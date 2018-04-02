import React from 'react';
import moment from 'moment';
import check from 'check-types';

import TimeLine from './Components/History/TimeLine';
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
			timescaleEnd: check.assigned(entries[0].end_date) ? moment(entries[0].end_date, 'YYYY-MM') : moment(),
			timescaleStart: moment(entries[entries.length - 1].begin_date, 'YYYY-MM'),
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
			<section className="history">
				<div className="history-item-wrapper">
					{history}
				</div>
				<TimeLine dates={dates} />
			</section>
		);
	}
}

export default History;
