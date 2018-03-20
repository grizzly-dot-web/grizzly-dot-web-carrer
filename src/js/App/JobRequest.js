
import React from 'react';
import marked from 'marked';

class JobRequest extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			content: this.props.data.content,
		};
	}

	render() {
		return (
			<div className="wrapper">
				<section className="content job-request">
					<div dangerouslySetInnerHTML={{ __html: marked(this.state.content) }} />
				</section>
			</div>
		);
	}

}

export default JobRequest;
