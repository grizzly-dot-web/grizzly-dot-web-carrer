import * as React from 'react';
import DefaultInfo from './InfoCenter/DefaultInfo';
import ClientSideComponent, { CmsState, CmsProps } from '../../Core/Components/Base/ClientSideComponent';

export interface InfoCenterProps extends CmsProps<any> {
}

export class VisibleRegions { [region:string] : { [cookieName:string] : boolean } }
export interface InfoCenterState extends CmsState {
	classes: string[]
	visibleRegions: VisibleRegions
}

export default class InfoCenter extends ClientSideComponent<InfoCenterProps, InfoCenterState> {

	constructor(props : any) {
		super(props);

		let visibleRegions : VisibleRegions = {} 
		for (let region in this.props.data.childrenInfo) {
			if (!visibleRegions[region]) {
				visibleRegions[region] = {}
			}

			// TODO refactor Components Data binding, its ugly 
			for (let className in this.props.data.childrenInfo[region]) {
				let child = this.props.data.childrenInfo[region][className];

				let cookieName = null;
				if (child && child.props && child.props.cookieName) {
					cookieName = child.props.cookieName;
				}

				if (cookieName === null) {
					throw new Error(`Unhandled: child "${child}" missing properties`);

				}

				visibleRegions[region][cookieName] = true;
			}
		}


		this.state = {
			classes: [],
			visibleRegions: visibleRegions
		} 
	}

	render() {
		return (
			<aside className={`InfoCenter ${this.state.classes.join(' ')}`}>
				{this.renderRegions()}
			</aside>
		);
	}

	changeStateClasses(classes : string[]) {
		return new Promise((resolve) => {
			this.setState({
				...this.state,
				classes: classes
			}, resolve)
		})
	}

	renderRegions() {
		let children = [];
		let regions = Object.keys(this.props.data.childrenInfo);
		for (let region of regions) {
			let regionChild = this.renderSingleRegion(region);

			if (regionChild === null) {
				continue;
			}

			children.push(regionChild)
		};

		if (children.length <= 0) {
			return null;
		}

		return children;
	}

	renderSingleRegion(region : string) {
		let children = this.renderChildren({
			'DefaultInfo' : {
				class: DefaultInfo,
				props: {
					onInfoHidden: (cookieName : any) => {
						let updatedRegions = {...this.state.visibleRegions};
						delete updatedRegions[region][cookieName];

						this.updateRegions(updatedRegions);
					}
				}
			},
		}, region);

		return (
			<div key={region} className={`InfoCenter_Region InfoCenter_Region-${region}`}>
				{children}
			</div>
		);
	}

	componentDidMount() {
		this.updateClasses();
	}
	

	updateRegions(updatedRegions : VisibleRegions): any {
		this.setState({
			...this.state,
			visibleRegions: updatedRegions
		}, this.updateClasses.bind(this));
	}
	
	updateClasses() {
		let visibleRegions = 
			Object.keys(this.state.visibleRegions)
				.filter((region) => Object.keys(this.state.visibleRegions[region]).length > 0)
		;

		let classes = visibleRegions.map((region) => `InfoCenter_Region-${region}_isVisible`);

		if (classes.length > 0) {
			classes.push('InfoCenter-hasVisibleRegions');
			this.changeStateClasses(classes);
		}

		this.changeStateClasses(classes);	
	}
}