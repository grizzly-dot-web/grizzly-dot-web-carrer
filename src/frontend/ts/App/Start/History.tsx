import * as React from 'react';

import HistoryEntry, { HistoryEntryData, Institution } from '../Components/History/HistoryEntry';
import ScrollRoutingComponent from '../../Core/Components/Base/ClientSideScrollRoutingComponent';
import { CmsProps, CmsState } from '../../Core/Components/Base/ClientSideComponent';


export interface HistoryProps extends CmsProps<HistoryEntryData[]> {
}
export interface HistoryState extends CmsState {
	historyEntries : HistoryEntryData[]
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

    link() {
        return {
			url: '/career',
			title: 'Karriere',
			text: 'Karriere'
		}
	};

    navigationId() { return 'main' };
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
			historyEntries: entries,
		};
	}

	renderHistoryEntries() {
		let history = [];

		let first = true;
		this.historyElementRefs = [];
		for (let i = 0; i < this.state.historyEntries.length; i++) {
			let classes = [];
			let item = this.state.historyEntries[i];

			history.push(
				<HistoryEntry key={ i } data={ item }/>
			);
		}

		return history;
	}

	render() {
		let additionalClasses = [];

		return ( 
			<section ref={ref => this.ref = ref} className={ `history` }>
				<h1 className="History_Title history-main">Mein Lebenslauf</h1>
				<div className="History_Inner">
					{ this.renderHistoryEntries() }
				</div> 
			</section>
		);
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
