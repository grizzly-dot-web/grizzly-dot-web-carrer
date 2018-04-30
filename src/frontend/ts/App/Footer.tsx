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
				<a key={link.url} target="_blank" href={link.url}><img src={link.icon} alt=""/></a>
			));
		}

		return (
			<footer>
				<div className="profile">
					<div className="container">
						<div className="social-links">
							<h4>Zu finden bei</h4>
							{socialLinks}
						</div>
					</div>
				</div>
			</footer>
		);
	}
}

export default Header;
