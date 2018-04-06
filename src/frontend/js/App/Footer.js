import React from 'react';

class Header extends React.Component {

	constructor(props) {
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
