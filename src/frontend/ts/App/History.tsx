import * as React from 'react';

import moment from 'moment';
import * as check from 'check-types';

import HistoryEntry, { HistoryEntryData, Institution } from './Components/History/HistoryEntry';
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

	orderAscending<OrderableObject>(data : OrderableObject[], date : ((object : OrderableObject) => string)): OrderableObject[] {
		return data.sort((a, b) => {
			let aDate = date(a);
			let bDate = date(b);

			if (aDate < bDate) {
				return -1;
			}

			if (aDate > bDate) {
				return 1;
			}

			return 0;
		})
	}
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
	scrollDuration : number = 300
	animationDuration : number = 500
	scrollTimeout : number|undefined
	disableScrollObserving : boolean = false;
	scrollWaitTimeout : number|null = null;
	historyElementRefs : HTMLElement[] = [];

	constructor(props : any) {
		super(props);

		this.lastScrollY = 0;
		this.scrollWaitTimeout = null;
		this.historyElementRefs = [];

		this.ref = null;

		let entries : HistoryEntryData[] = [];
		if (this.props.data) {
			entries = this.props.data;
		}
		entries.map((e) => {
			e.institutions = this.orderAscending<Institution>(e.institutions, (a) => a.begin_date);
		});
		entries = this.orderAscending<HistoryEntryData>(entries, (a) => a.institutions[0].begin_date);

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
				<HistoryEntry key={ i } data={ item } childrenInfo={item.childrenInfo} enabled={active} onClick={() => { this.changeActiveHistoryIndex(i) }}/>
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
			this.handler.disableComponentConditionRouting();
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
							this.handler.enableComponentConditionRouting();
							return resolve()
						});
					}, this.animationDuration);
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
				this.handler.enableComponentConditionRouting();

				this.appElement.classList.add('history__is-active');
				this.appElement.classList.add('header__right-dark');
			
				this.lastScrollY = window.scrollY;

				return false;
			});

			return false;
		}, this.scrollDuration);
	}

	enter(): void {
		this.appElement.classList.add('history__is-active');
		this.appElement.classList.add('header__right-dark');
        this.appElement.classList.remove('header__bg-active');
	}

	leave(): void {
		this.appElement.classList.remove('history__is-active');
		this.appElement.classList.remove('header__right-dark');
	}
}

export default History;
