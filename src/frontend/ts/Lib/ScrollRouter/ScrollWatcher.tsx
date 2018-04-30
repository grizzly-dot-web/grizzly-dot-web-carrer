/// <reference path="../../../../typings/scroll.d.ts" />

import 'scrollingelement';

import { Scroll } from 'scroll';
import * as Ease from 'ease-component';


const canUseDOM = !!(
	typeof window !== 'undefined' &&
  window.document &&
  window.document.createElement
);

class ScrollWatcher {

	options: any

	callback: Function

	element: any

	disableScroll: boolean

	lockToScrollPos: Array<number>

	executingCallback: number

	firstCallAfterCallback: boolean

	scrollingBehaviourEnabled: boolean

	static get Key() : { [key : string] : number} {
		return {
			Left: 37,
			Up: 38,
			Right: 39,
			Down: 40,
			Space: 32,
			PageUp: 33,
			PageDown: 34,
			End: 35,
			Home: 36,
		};
	}

	static get EventType() : { [event : string] : string} {
		return {
			wheel: 'wheel',
			touchmove: 'touchmove',
			scroll: 'scroll',
			keydown: 'keydown',
		};
	}

	constructor(options : any = {}) {
		this.options = Object.assign({
			watchWheel: true,
			watchScroll: true,
			watchKeys: true,
			disableWheel: true,
			disableScroll: true,
			disableKeys: true,
			callbackExecutionTime: 1000,
			keyboardKeys: Object.keys(ScrollWatcher.Key).map((keyName) => ScrollWatcher.Key[keyName]),
			authorizedInInputs: [
				ScrollWatcher.Key.Left,
				ScrollWatcher.Key.Right,
				ScrollWatcher.Key.Up,
				ScrollWatcher.Key.Down,
				ScrollWatcher.Key.Space
			]
			// space: 32, left: 37, up: 38, right: 39, down: 40, page up: 33, page down: 34, end: 35, home: 36
		}, options);

		this.lockToScrollPos = [0, 0];

		this.executingCallback = null;
		this.firstCallAfterCallback = true;

		this.handleScroll = this.handleScroll.bind(this);
		this.handleWheel = this.handleWheel.bind(this);
		this.handleKeydown = this.handleKeydown.bind(this);
	}

	on(element : HTMLElement, callback: Function) {
		if (!canUseDOM) return;

		this.callback = callback;
		this.element = element || canUseDOM ? document.scrollingElement : null;

		const { watchKeys, watchScroll, watchWheel } = this.options;

		this.callback = callback;

		if (watchWheel) {
			document.addEventListener('wheel', this.handleWheel);
			document.addEventListener('touchmove', this.handleWheel);
		}

		if (watchScroll) {
			this.lockToScrollPos = [
				this.element.scrollX || this.element.scrollTop,
				this.element.scrollY || this.element.scrollLeft
			];

			document.addEventListener('scroll', this.handleScroll);
		}

		if (watchKeys) {
			document.addEventListener('keydown', this.handleKeydown);
		}
	}

	/**
   * Re-enable page scrolls
   */
	destroy() {
		if (!canUseDOM) return;

		document.removeEventListener('wheel', this.handleWheel);
		document.removeEventListener('touchmove', this.handleWheel);
		document.removeEventListener('scroll', this.handleScroll);
		document.removeEventListener('keydown', this.handleKeydown);
	}

	handleWheel(e : Event) {
		let allowDefaultBehaviour = this.options.disableWheel;
		if (typeof this.callback !== 'undefined') {
			allowDefaultBehaviour = this.handleCallback(e, e.type);
		}

		if (!allowDefaultBehaviour) {
			e.preventDefault();
			return false;
		}

		return true;
	}

	handleScroll(e : Event) {
		let allowDefaultBehaviour = this.options.disableScroll;
		if (typeof this.callback !== 'undefined') {
			allowDefaultBehaviour = this.handleCallback(e, e.type);
		}

		if (!allowDefaultBehaviour) {
			console.log(this.lockToScrollPos);
			window.scrollTo(...this.lockToScrollPos);
			return false;
		}

		return true;
	}

	handleKeydown(e : KeyboardEvent) {
		let keys = this.options.keyboardKeys;
		let target : any = e.target;
		let eventTarget = target.tagName;

		if (!eventTarget) {
			eventTarget = '';
		}

		if (['INPUT', 'TEXTAREA'].includes(eventTarget.toUpperCase())) {
			keys = this.options.authorizedInInputs;
		}

		if (!keys.includes(e.keyCode)) {
			return false;
		}

		let allowDefaultBehaviour = this.options.disableKeys;
		if (typeof this.callback !== 'undefined') {
			allowDefaultBehaviour = this.handleCallback(e, e.type, e.keyCode);
		}

		if (!allowDefaultBehaviour) {
			e.preventDefault();
			return false;
		}

		return this.scrollingBehaviourEnabled;
	}

	enableDefaultBehaviour() {
		this.scrollingBehaviourEnabled = false;
	}

	preventDefaultBehaviour() {
		this.scrollingBehaviourEnabled = false;
	}

	handleCallback(e : Event, type : string, key : number = null) {
		let callbackProps = [e, type, key];
		this.allowScrollForDuration(this.callback, this.options.callbackExecutionTime, callbackProps);
	}

	scroll(element : HTMLElement, to : number, duration : number, options : any) {
		this.allowScrollForDuration(() => {
			Scroll(element, to, options);
		}, duration);

	}
	
	allowScrollForDuration(callback: Function, duration: number, callbackProps: any = null) {
		console.log('SCROLLING ALLOWED '+ this.firstCallAfterCallback);
		if (this.executingCallback != null && !this.firstCallAfterCallback) {
			return this.scrollingBehaviourEnabled;
		}

		let returnBool = this.firstCallAfterCallback;
		this.firstCallAfterCallback = false;
		
		this.executingCallback = window.setTimeout(() => {
			clearTimeout(this.executingCallback);
			this.executingCallback = null;

			if (this.disableScroll) {
				this.lockToScrollPos = [
					this.element.scrollX || this.element.scrollTop,
					this.element.scrollY || this.element.scrollLeft
				];
			}
			if (callbackProps) {
				callback(...callbackProps);
			} else {
				callback();
			}

			this.firstCallAfterCallback = true;
		}, duration);

		return returnBool;
	}
}

export default ScrollWatcher;
