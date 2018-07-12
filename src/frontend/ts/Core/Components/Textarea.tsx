import * as React from 'react';
import Mardown from 'markdown-to-jsx';

import CmsControlledComponent, { CmsState, CmsProps } from '../CmsControlledComponent';

export interface TextProps extends CmsProps<string> {
	classes: string[]
}
export interface TextState extends CmsState {

}

export default class Textarea extends CmsControlledComponent<TextProps, TextState> {

	render() {
		if (typeof this.props.data !== 'string') {
			throw new Error('Empty Textarea')
		}

		let classes : string[] = [];
		if (this.props.classes) {
			classes = this.props.classes;
		}

		return (<Mardown className={`textarea ${classes.join(' ')}`} options={ {} } key={this.props.key}>{this.props.data}</Mardown>);
	}
	
}
