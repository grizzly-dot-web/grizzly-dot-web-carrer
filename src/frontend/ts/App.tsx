import * as React from 'react';

import Header from './App/_Header';
import Footer from './App/_Footer';
import Histroy from './App/History';
import ExperienceOverview from './App/ExperienceOverview';

//import ScrollRouter from './Lib/ScrollRouter';

export interface AppProps {
	data : any
}

class App extends React.Component<AppProps> {

	constructor(props : any) {
		super(props);
	}

	// TODO rewrite jobRequest and Accordeon	<JobRequest data={ this.props.carrer.jobRequest } />
	render() {
		return (
			<div>
				<Header data={this.props.data.header} />
				<main>
					<ExperienceOverview data={this.props.data.history} />
					<Histroy data={this.props.data.history} />
				</main>
				<Footer data={this.props.data.footer} />	
			</div>
		);
	}

	componentDidMount() {
	//	new ScrollRouter({});
	}

}

export default App;
