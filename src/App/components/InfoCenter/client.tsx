import * as React from 'react';
import AtomicComponent from '../../../lib/atomicCCMS/_shared/Components/Abstract/AtomicComponent/client';
import { AtomicState, AtomicProps } from '../../../lib/atomicCCMS/_shared/Components/Abstract/AtomicComponent/client';
import { AtomicRegion } from '../../../lib/atomicCCMS/_shared/Components/AtomicRegion/client';
import CookieInfo, { CookieInfoProps } from './_shared/components/CookieInfo/client';

export interface VisibleRegions { [region:string] : { [cookieName:string] : boolean } }

export interface InfoCenterData {
	[region:string] : string
}

export interface InfoCenterState extends AtomicState {
	classes: string[]
	visibleRegions: VisibleRegions
}

export default class InfoCenter extends AtomicComponent<AtomicProps<InfoCenterData>, InfoCenterState> {

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
		for (let region in this.props.data) {
			children.push(
				<div key={region} className={`InfoCenter_Region InfoCenter_Region-${region}`}>
				<AtomicRegion key={region} name={region} data={this.props.data[region]} childrenConfig={
					{
						'CookieInfo': {
							class: CookieInfo,
							props: {
								onInfoHidden: (cookieName : any) => {
									let updatedRegions = {...this.state.visibleRegions};
									delete updatedRegions[region][cookieName];
			
									this.updateRegions(updatedRegions);
								}
							}
						}
					}
				} />
			</div>
			)
		}

		if (children.length <= 0) {
			return null;
		}

		return children;
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