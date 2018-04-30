import * as React from 'react';

import Header from './App/Header';
import Footer from './App/Footer';
import Histroy from './App/History';

//import ScrollRouter from './Lib/ScrollRouter';

export interface AppProps {
	data : any
}

class App extends React.Component<AppProps> {

	wrapperRef : HTMLDivElement|null

	constructor(props : any) {
		super(props);

		this.wrapperRef = null;
	}

	// TODO rewrite jobRequest and Accordeon	<JobRequest data={ this.props.carrer.jobRequest } />
	render() {
		return (
			<div ref={ (ref) => this.wrapperRef = ref}>
				<Header data={this.props.data.header} />
				<main>
					<Histroy data={this.props.data.history} />
				</main>
				<Footer data={this.props.data.footer} />	
			</div>
		);
	}

	componentDidMount() {
	//	new ScrollRouter({});
	}

	componentWillUnmount() {}

	handleInternalLinkClick(e : Event) {
		e.preventDefault();
		return false;
	}
}

export default App;
