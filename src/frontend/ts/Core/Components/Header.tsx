import * as React from 'react';

import CmsControlledComponent, { CmsState, CmsProps } from '../CmsControlledComponent';
import Textarea from './Textarea';
import Headline from './Headline';

export interface HeaderProps extends CmsProps<null> {

}
export interface HeaderState extends CmsState { 

}

export default class Header extends CmsControlledComponent<HeaderProps, HeaderState> {

	constructor(props : any) {
		super(props);
	}

	render() {
		return (
			<header key={this.props.key}>
				{this.renderChildren({
					'Headline' : Headline,
				})}
			</header>
		);
	}

}
