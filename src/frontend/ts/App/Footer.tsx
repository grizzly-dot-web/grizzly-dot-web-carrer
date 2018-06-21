import * as React from 'react';

export interface AppProps {
	data : any
}
class Header extends React.Component<AppProps> {

	constructor(props : any) {
		super(props);
	}

	render() {
		let socialLinks = [];
		for (let link of this.props.data.social_links) {
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

export default Header;
