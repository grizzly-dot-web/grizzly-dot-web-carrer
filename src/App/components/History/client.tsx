import * as React from 'react';

import HistoryEntry, { HistoryEntryData, Institution } from '../../../../odd_src/frontend/ts/App/Components/History/HistoryEntry';
import HistoryLastEntry from '../../../../odd_src/frontend/ts/App/Components/History/HistoryLastEntry';

import AtomicComponent, { AtomicProps, AtomicState } from '../../../../atomicCCMS/_shared/Components/Abstract/AtomicComponent/client';

export interface HistoryProps extends AtomicProps<HistoryEntryData[]> {

}

export interface HistoryState extends AtomicState {
	historyEntries : HistoryEntryData[]
}

export default class History extends AtomicComponent<HistoryProps, HistoryState> {

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

			if ( i >= this.state.historyEntries.length -1) {
			
				history.push(
					<HistoryLastEntry key={ i } data={ item }/>
				);	
				continue;
			}

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
				<header className="History_Header">
					<h1 className="History_Header_Title">Mein Lebenslauf</h1>
				</header>
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
}