import * as React from 'react';

export interface SocialLink {
	url : string
	
	icon : string

	name : string
}

export interface FooterProps {
	onFeedbackClick: (e : React.MouseEvent<HTMLButtonElement>) => void
	socialLinks: SocialLink[]
}

export default class Footer extends React.Component<FooterProps> {

	constructor(props : any) {
		super(props);
	}

	render() {
		let socialLinks = [];
		for (let link of this.props.socialLinks) {
			socialLinks.push((
				<a key={link.url} target="_blank" href={link.url}><img src={link.icon} alt=""/>{link.name}</a>
			));
		}

		return (
			<footer className="App_Footer">
				<div className="container">
					<div className="social-links">
						<h4>Du findest mich auch auf</h4>
						{socialLinks}
					</div>
					<nav className="meta-nav">
						<h4>Zu dieser Seite</h4>
						<button onClick={this.props.onFeedbackClick}>Feedback / Bug report</button>
						<a href="https://github.com/grizzlydotweb/grizzly-dot-web-career" target="_blank">Opensource (github.com)</a>
					</nav>
				</div>
			</footer>
		);
	}
}