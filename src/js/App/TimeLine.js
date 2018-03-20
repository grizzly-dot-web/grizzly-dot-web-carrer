
import React from 'react'
import Navigation from './Navigation'
import HistoryEntry from './HistoryEntry'

class TimeLine extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
		let history = [];

		let dates = [];
		let first = true;
		for (let item of this.props.history) {
			let classes = [];
			dates.push(item.begin_date);

			if (first) {
				classes.push('first-entry');
				first = false;
			}

			history.push((
				<HistoryEntry additionalClasses={classes} key={item.begin_date} entry={item}/>
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
