import * as React from 'react';

import Header from './App/_Header';
import Footer from './App/_Footer';
import Histroy from './App/History';
import ExperienceOverview from './App/ExperienceOverview';
import Intro from './App/Intro';
import CmsControlledComponent, { CmsState, CmsProps } from './Core/CmsControlledComponent';
import Textarea from './Core/Components/Textarea';
import Outro from './App/Outro';

//import ScrollRouter from './Lib/ScrollRouter';

export interface AppProps extends CmsProps<any> {
}
export interface AppState extends CmsState {
}

class App extends CmsControlledComponent<AppProps, AppState> {

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
					<Intro data={this.props.data.intro} />
					<Histroy data={this.props.data.history} />
					<Outro data={this.props.data.outro} />
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
