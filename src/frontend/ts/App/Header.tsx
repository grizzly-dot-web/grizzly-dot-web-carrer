import * as React from 'react';

export interface AppProps {
	data : any
}
class Header extends React.Component<AppProps> {

	constructor(props : any) {
		super(props);

		this.state = {
			data: this.props.data
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
			<header id="page-header" className={"header__right-dark"}>
				<div className="container">
					<a className="logo" href="/">
						<h1>
							Sebastian<br />
							Müller
						</h1>
						<h2>
							{spanPerCharacter('grizzly.web')}
						</h2>
					</a>
					<a className="experience-link">
						Skills <span className="circle">&</span> Referenzen
					</a>
					<nav className="main-nav">
						<a className="active" href="/">Start</a>
						<a href="/career">Karriere</a>
						<a href="/booking">Beauftragen</a>
					</nav>
				</div>
			</header>
		);
	}
}

export default Header;
