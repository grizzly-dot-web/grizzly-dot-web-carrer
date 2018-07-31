import * as React from 'react';

export default class Header extends React.Component {

	constructor(props : any) {
		super(props);

		this.state = {
			navigations: { main: null }
		};
	}

	render() {
		let spanPerCharacter = (word : string) => {
			let chars = [];
			let counter = 0;
			for (let char of word) {
				counter++;
				chars.push(
					<span key={counter}>{char}</span>
				);
			}

			return (<div className={"justify-chars"}>{chars}</div>);
		}

		return (
			<header className="App_Header">
				<div className="container">
					<a className="logo" href="/start">
						<h1>
							<div className="name">
								Sebastian<br /> 
								Müller
							</div>
							<div className="company">{spanPerCharacter('grizzly.web')}</div>
						</h1>
					</a>
				</div>
			</header>
		);
	}
}