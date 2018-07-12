import * as React from 'react';
import CmsControlledComponent, { CmsProps, CmsState } from '../Core/CmsControlledComponent';
import { Navigation } from '../Core/Router/Navigation';

export interface HeaderProps extends CmsProps<any> {
}

export interface HeaderState extends CmsState {
	navigations : any 
}

export default class Header extends CmsControlledComponent<HeaderProps, HeaderState> {

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
					<Navigation identifier={'main'} />
				</div>
			</header>
		);
	}

	componentDidMount() {
		//this.updateNavigationState('main')
	}
}