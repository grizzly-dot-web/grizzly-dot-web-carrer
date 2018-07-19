import * as React from 'react';
import CmsControlledComponent, { CmsProps, CmsState } from '../../Core/CmsControlledComponent';
import DefaultInfo from './InfoCenter/DefaultInfo';

export interface InfoCenterProps extends CmsProps<any> {
}

export interface InfoCenterState extends CmsState {

}

export default class InfoCenter extends CmsControlledComponent<InfoCenterProps, InfoCenterState> {

	constructor(props : any) {
		super(props);
	}

	render() {
		
		let children = [];
		for (let region of ['bottom', 'center']) {
			let regionChild = this.renderChildrenByRegion(region);

			if (regionChild === null) {
				continue;
			}

			children.push(regionChild)
		};

		if (children.length <= 0) {
			return null;
		}

		return (
			<aside className="info-center">
				{children}
			</aside>
		);
	}

	renderChildrenByRegion(region : string) {
		let lowerLeft = this.renderChildren({
			'DefaultInfo' : {
				class: DefaultInfo,
			},
		}, region)

		if (!lowerLeft || lowerLeft.length <= 0) {
			return null;
		}

		return (
			<div key={region} className={`region-${region}`}>
				{lowerLeft}
			</div>
		);
	}
}