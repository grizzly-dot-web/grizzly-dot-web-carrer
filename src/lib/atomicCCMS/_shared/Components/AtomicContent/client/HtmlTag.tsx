import * as React from 'react';

export interface HtmlTagProps {
	tag:string, 
	id?: string
	className?: string
}


export default class HtmlTag extends React.Component<HtmlTagProps> {

	render() {
		let Tag = this.props.tag;
		return (<Tag id={this.props.id} className={this.props.className}>{this.props.children}</Tag>);
	}
	
}
