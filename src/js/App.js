import React from 'react';

import Header from './App/Header';
import Footer from './App/Footer';
import Histroy from './App/History';

class App extends React.Component {

	constructor(props) {
		super(props);
	}

	// TODO rewrite jobRequest and Accordeon	<JobRequest data={ this.props.carrer.jobRequest } />
	render() {
		return (
			<div>
				<Header data={this.props.data.header} />
				<main>
					<Histroy data={this.props.data.history} />
				</main>
				<Footer data={this.props.data.footer} />
			</div>
		);
	}
}

export default App;
