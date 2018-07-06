import * as React from 'react';

import CmsControlledComponent, { CmsProps, CmsState } from '../CmsControlledComponent';

export interface HeadlineData {
	tag:string, 
	text:string,
	classes?: string[]
};

export interface HeadlineProps extends CmsProps<HeadlineData> {

}
export interface HeadlineState extends CmsState { 

}


export default class Headline extends CmsControlledComponent<HeadlineProps, HeadlineState> {

	render() {
		let data = this.props.data;
		if (!data) {
			return;
		}

		let classes : string[] = [];
		if (data.classes) {
			classes = data.classes;
		}

		let Tag = data.tag;
		return (<Tag key={this.props.key} className={classes.join(' ')}>{data.text}</Tag>);
	}
	
}
