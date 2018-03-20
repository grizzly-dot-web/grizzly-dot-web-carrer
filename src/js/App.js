
import React from 'react'

import Profile from './App/Header'
import TimeLine from './App/TimeLine'
import JobRequest from './App/JobRequest'

class App extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<main>
				<Profile visual={null} profile={this.props.carrer.profile} />
				<JobRequest data={ this.props.carrer.jobRequest } />
				<TimeLine history={this.props.carrer.history} />
			</main>
		);
	}
}

export default App;
