import * as React from 'react';

import AtomicComponent, { AtomicProps } from '../../../atomicCCMS/_shared/Components/Abstract/AtomicComponent/client';
import { Navigation } from '../../../atomicCCMS/client/Router/Navigation';



export interface FooterProps extends AtomicProps {
	social_links: {
		url : string,
		icon : string,
		name : string 
	}[]
}

export default class Footer extends AtomicComponent<FooterProps> {

	constructor(props : any) {
		super(props);
	}

	render() {
		let socialLinks = [];
		for (let link of this.props.social_links) {
			socialLinks.push((
				<a key={link.url} target="_blank" href={link.url}><img src={link.icon} alt=""/>{link.name}</a>
			));
		}

		return (
			<footer>
				<div className="container">
					<div className="social-links">
						<h4>Du findest mich auch auf</h4>
						{socialLinks}
					</div>
					<nav className="meta-nav">
						<h4>Zu dieser Seite</h4>
						<a href="/feedback">Feedback / Bug report</a>
						<a href="https://github.com/sebgrizzly/LifeCareer" target="_blank">Opensource (github.com)</a>
					</nav>
				</div>
			</footer>
		);
	}
}
