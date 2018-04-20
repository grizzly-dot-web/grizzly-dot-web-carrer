import 'scrollingelement';

const canUseDOM = !!(
	typeof window !== 'undefined' &&
  window.document &&
  window.document.createElement
);

class ScrollWatcher {
	static get Key() {
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

	static get EventType() {
		return {
			wheel: 'wheel',
			touchmove: 'touchmove',
			scroll: 'scroll',
			keydown: 'keydown',
		};
	}

	constructor(options) {
		this.options = Object.assign({
			watchWheel: true,
			watchScroll: true,
			watchKeys: true,
			disableWheel: true,
			disableScroll: true,
			disableKeys: true,
			keyboardKeys: [32, 33, 34, 35, 36, 37, 38, 39, 40],
			authorizedInInputs: [32, 37, 38, 39, 40]
			// space: 32, page up: 33, page down: 34, end: 35, home: 36
			// left: 37, up: 38, right: 39, down: 40
		}, options);

		this.lockToScrollPos = [0, 0];

		this.handleScroll = this.handleScroll.bind(this);
		this.handleWheel = this.handleWheel.bind(this);
		this.handleKeydown = this.handleKeydown.bind(this);
	}

	/**
   * watch Page Scroll
   * @external Node
   *
   * @param {HTMLElement} [element] - DOM Element, usually document.body
   * @param {function} [callback] - Change the initial options
   */
	on(element, callback) {
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
				this.element.scrollLeft || this.element.scrollX,
				this.element.scrollTop || this.element.scrollY
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

	handleWheel(e) {
		let preventDefault = this.options.disableWheel;
		if (typeof this.callback !== 'undefined') {
			preventDefault = !this.callback(e, e.type);
		}

		if (preventDefault) {
			e.preventDefault();
			return false;
		}

		return true;
	}

	handleScroll(e) {
		let preventDefault = this.options.disableScroll;
		if (typeof this.callback !== 'undefined') {
			preventDefault = !this.callback(e, e.type);
		}

		if (preventDefault) {
			window.scrollTo(...this.lockToScrollPos);
			return false;
		}

		return true;
	}

	handleKeydown(e) {
		let keys = this.options.keyboardKeys;
		let eventTarget = e.target.tagName;

		if (!eventTarget) {
			eventTarget = '';
		}

		if (['INPUT', 'TEXTAREA'].includes(eventTarget.toUpperCase())) {
			keys = this.options.authorizedInInputs;
		}

		if (!keys.includes(e.keyCode)) {
			return false;
		}

		let preventDefault = this.options.disableKeys;
		if (typeof this.callback !== 'undefined') {
			preventDefault = !this.callback(e, e.type, e.keyCode);
		}

		if (preventDefault) {
			e.preventDefault();
			return false;
		}

		return true;
	}
}

export default ScrollWatcher;
