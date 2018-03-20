
import React from 'react'
import marked from 'marked'

class JobOffer extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			content: this.props.data.content,
		}
	}

	render() {
		return (
			<section className="content job-offer">
				<div dangerouslySetInnerHTML={{ __html: marked(this.state.content.replace('\n', "\n")) }} />
			</section>
		);
	}

}

export default JobOffer;
