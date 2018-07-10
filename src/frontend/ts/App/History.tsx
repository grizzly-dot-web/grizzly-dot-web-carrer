import * as React from 'react';

import moment from 'moment';
import * as check from 'check-types';

import HistoryEntry, { HistoryEntryData } from './Components/History/HistoryEntry';
import ScrollRoutingComponent from '../Core/Router/ScrollRoutingComponent';
import { CmsState, CmsProps } from '../Core/CmsControlledComponent';
import { CmsRoutingState } from '../Core/Router/AbstractRoutingComponent';

import { ScrollWatcher } from '../Helper/cross-scroll-contorl';
import scroll from 'scroll';
import page from 'scroll-doc';
import { PositionChecker } from '../Helper/PositioningHelper';


export interface HistoryProps extends CmsProps<HistoryEntryData[]> {
}
export interface HistoryState extends CmsRoutingState {
	historyEntries : HistoryEntryData[]
	activeHistoryIndex : number|false
}

class History extends ScrollRoutingComponent<HistoryProps, HistoryState> {

    navigationId() {
		return 'main';
	}
    link() {
        return {
			url: '/career',
			title: 'Karriere',
			text: 'Karriere'
		};
	}

	ref: HTMLElement | null;

	lastScrollY : number = 0;
	scrollDuration : number = 500
	animationDuration : number = 500
	scrollTimeout : number|undefined
	disableScrollObserving : boolean = false;
	scrollWaitTimeout : number|null = null;
	historyElementRefs : HTMLElement[] = [];
	scrollWatcher : ScrollWatcher

	constructor(props : any) {
		super(props);

		this.lastScrollY = 0;
		this.scrollWaitTimeout = null;
		this.historyElementRefs = [];

		this.ref = null;

		let data : HistoryEntryData[] = [];
		if (this.props.data) {
			data = this.props.data;
		}
		let entries = data.sort((a, b) => {
			let aDate = moment(a.institutions[0].begin_date);
			let bDate = moment(b.institutions[b.institutions.length -1].begin_date);

			if (aDate < bDate) {
				return -1;
			}

			if (aDate > bDate) {
				return 1;
			}

			return 0;
		});

		this.state = {
			isActive: false,
			historyEntries: entries,
			navigationRegistry: null,
			activeHistoryIndex: false,
		};

		this.changeActiveHistoryIndex = this.changeActiveHistoryIndex.bind(this);
	}

	renderHistoryEntries() {
		let history = [];

		let first = true;
		this.historyElementRefs = [];
		for (let i = 0; i < this.state.historyEntries.length; i++) {
			let classes = [];
			let item = this.state.historyEntries[i];

			let active = false;
			if (this.state.activeHistoryIndex !== false && i === this.state.activeHistoryIndex) {
				active = true;
			}

			history.push(
				<HistoryEntry key={ i } data={ item } enabled={active} onClick={() => this.changeActiveHistoryIndex(i)}/>
			);
		}

		return history;
	}
	
	changeActiveHistoryIndex(i : number|false) {
		return new Promise((resolve, reject) => {
			let index = i;
			if (i >= this.state.historyEntries.length) {
				index = false;
			}

			if (index === false || index <= -1) {
				this.setState(
					Object.assign(
						this.state,
						{
							activeHistoryIndex: index
						}
					), 
					() => {
						return resolve();	
					}
				);	
			}

			let ref = this.ref as HTMLElement;
			let activeElement = ref.querySelectorAll('.history-entry')[i as number] as HTMLElement|null;
			this.setState(
				Object.assign(
					this.state,
					{
						activeHistoryIndex: index
					}
				), 
				() => {
					setTimeout(() => {
						if (!activeElement) {
							return reject();
						}
	
						this.disableScrollObserving = true;
						scroll.top(page(), activeElement.offsetTop, { duration: this.scrollDuration }, () => {
							this.disableScrollObserving = false;
							this.lastScrollY = window.scrollY;
							return resolve()
						});
					}, this.animationDuration/2);
				}
			);
		});
	}

	render() {
		let additionalClasses = [];

		return ( 
			<section ref={ref => this.ref = ref} className={ `history` }> 
				{ this.renderHistoryEntries() } 
			</section>
		);
	}

	changeActiveHistoryIndexByScrollDirection(direction : {down : boolean, right : boolean}) {
		if (this.scrollTimeout !== undefined) {
			return false;
		}

		this.scrollTimeout = window.setTimeout(() => {
			if (this.state.activeHistoryIndex === false) {
				return false;
			}

			let index = this.state.activeHistoryIndex - 1;
			if (direction.down) {
				index = this.state.activeHistoryIndex + 1;
			}

			this.changeActiveHistoryIndex(index).then(() => {
				this.appElement.classList.add('history__is-active');
				this.appElement.classList.add('header__right-dark');
			
				this.lastScrollY = window.scrollY;

				return false;
			});

			return false;
		}, this.scrollDuration);
	}

	enter(): void {
		this.disableScrollObserving = false;

		this.handler.disableComponentConditionRouting();
		this.changeActiveHistoryIndex(0).then(() => {
			let scrollTimeout : number|null = null;
			
			let direction = null;

			this.scrollWatcher = new ScrollWatcher(null, {
			});
			let extraRange = 20;
			this.handler.disableComponentConditionRouting();
			this.scrollWatcher.watch((e, type, direction, key) => {
				if (this.disableScrollObserving) {
					return false;
				}

				let ref = this.ref as HTMLElement;
				let target = this.scrollWatcher.element||window;
				let lastHistroyItemIsInViewport = (range = 0) => PositionChecker.elementIsInsideTarget(ref.querySelector('.history-entry:last-of-type') as HTMLElement, target, range);
				let firstHistroyItemIsInViewport = (range = 0) => PositionChecker.elementIsInsideTarget(ref.querySelector('.history-entry:first-of-type') as HTMLElement, target, range);

				if (firstHistroyItemIsInViewport() || lastHistroyItemIsInViewport()) {
					return true;
				}

				this.changeActiveHistoryIndexByScrollDirection(direction);
				return false;
			});
			
			this.appElement.classList.add('history__is-active');
			this.appElement.classList.add('header__right-dark');
		});
		
	}

	leave(): void {
		this.scrollWatcher.destroy();
		this.handler.enableComponentConditionRouting();
		this.appElement.classList.remove('history__is-active');
		this.appElement.classList.remove('header__right-dark');
	}
}

export default History;
