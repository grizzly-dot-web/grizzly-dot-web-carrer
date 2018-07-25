import * as React from 'react';
import { Navigation } from '../../Core/Components/Navigation';
import ClientSideComponent, { CmsState, CmsProps } from '../../Core/Components/Base/ClientSideComponent';

export interface HeaderProps extends CmsProps<any> {
}

export interface HeaderState extends CmsState {
	navigations : any 
}

export default class Header extends ClientSideComponent<HeaderProps, HeaderState> {

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
					<a className="logo" href="/start">
						<h1>
							<div className="name">
								Sebastian<br /> 
								Müller
							</div>
							<div className="company">{spanPerCharacter('grizzly.web')}</div>
						</h1>
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