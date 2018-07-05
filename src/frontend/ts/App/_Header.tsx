import * as React from 'react';
import CmsControlledComponent from '../Core/CmsControlledComponent';

export interface AppProps {
	data : any
}
class Header extends CmsControlledComponent<AppProps> {

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
			<header id="page-header">
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
					{this.handler.renderNavigation('main')}
				</div>
			</header>
		);
	}
}

export default Header;
