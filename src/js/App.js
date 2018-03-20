
import React from 'react'

import Profile from './App/Profile'
import JobOffer from './App/JobOffer'
import TimeLine from './App/TimeLine'

class App extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<main>
				<Profile visual={null} profile={this.props.carrer.profile} />
				<JobOffer data={ this.props.carrer.jobOffer } />
				<TimeLine history={this.props.carrer.history} />
			</main>
		);
	}
}

export default App;
