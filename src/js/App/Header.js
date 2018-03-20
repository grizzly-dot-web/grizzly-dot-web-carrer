
import React from 'react'
import moment from 'moment'

class Header extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
		let birthday = moment(this.props.profile.birth_date, 'DD.MM.YYYY');

		let socialLinks = [];
		for (let link of this.props.profile.social_links) {
			socialLinks.push((
				<a key={link.url} target="_blank" href={link.url}><img src={link.icon} alt=""/></a>
			));
		}

		let languages = [];
		for (let language of this.props.profile.languages) {
			languages.push((
				<div key={language.code} className="progress">
					<span className="level">{language.level +"%"}</span>
					<div className="bar" style={{width: language.level +"%"}}><span className="title">{language.title}</span></div>
				</div>
			));
		}

		let facts = [];
		for (let fact of this.props.profile.facts) {
			facts.push((
				<dl key={fact.label}>
					<dt>{fact.label}</dt>
					<dd>{fact.value}</dd>
				</dl>
			));
		}

		return (
			<header>
				<div className="visual" style={{ backgroundImage: this.props.profile.visual }} />
				<div className="profile">
					<figure className="image">
						<img src={this.props.profile.image} alt="Profilbild" />
					</figure>
					<div className="content">
						<h1>{this.props.profile.display_name}</h1>
						<h2>{this.props.profile.occupation_title}</h2>
						<div className="facts">
							{facts}
						</div>
						<div className="languages">
							<h3>Sprachkenntnisse</h3>
							{languages}
						</div>
						<div className="social-links">
							<h4>Zu finden bei</h4>
							{socialLinks}
						</div>
					</div>
				</div>
			</header>
		);
	}
}

export default Header;
