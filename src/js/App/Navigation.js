
import React from 'react'

class Navigation extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
		let list = [];

		for (let date of this.props.dates) {
			list.push((
				<li key={date}><a href={"#"+ date}>{date}</a></li>
			))
		}

		let height = window.height;

		return (
			<ul>
				{list}
			</ul>
		);
	}
}

export default Navigation;