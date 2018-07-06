import * as React from 'react';
import marked from 'marked';

import CmsControlledComponent, { CmsState, CmsProps } from '../CmsControlledComponent';

export interface TextProps extends CmsProps<string[]> {

}
export interface TextState extends CmsState {

}

export default class Textarea extends CmsControlledComponent<TextProps, TextState> {

	render() {
		if (!this.props.data) {
			return;
		}

		let paragraph = [];
		let counter = 0;
		for (let text of this.props.data) {
			counter++;
			paragraph.push(<p key={counter}>{text}</p>);
		}

		return (<div key={this.props.key}>{paragraph}</div>);
	}
	
}
