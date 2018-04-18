import 'scrollingelement';

import scroll from 'scroll';
import ease from 'ease-component';

import Router from './ScrollRouter/Router';
import ScrollWatcher from'./ScrollRouter/ScrollWatcher';

class ScrollRouter extends Router {
	constructor(options) {
		super(options);
		this.durationPerRouteDepth = [
			1000,
			2000,
			1000
		];

		this.handleFirstRoutePart = this.handleFirstRoutePart.bind(this);
		this.handleSecondRoutePart = this.handleSecondRoutePart.bind(this);
		this.handleThirdRoutePart = this.handleThirdRoutePart.bind(this);

		this.options = {
			durationPerRouteDepth: this.durationPerRouteDepth,
			routingBehaviourPerRouteDepth: [
				this.handleFirstRoutePart,
				this.handleSecondRoutePart,
				this.handleThirdRoutePart
			]
		};
        
		this._watcher = new ScrollWatcher();

		this._watcher.on(document.scrollingElement, () => {
			console.log(this.lastDispatchedRoute.parts[this.lastDispatchedRoute.parts.length -1].slug);
			return false;
		});
        
		this.dispatch(window.location.pathname);
		window.onpopstate = this.dispatch.bind(this);
	}

	dispatch(pathname) {
		super.dispatch(pathname).then(
			() => {
				console.log('successfull dispatched');
			},
			() => {
				console.log('unsuccessfull dispatched');
			}
		);
	}

	handleFirstRoutePart(slug, depth, element) {
		if (element && !element.classList.contains('is-active')) {
			scroll.top(document.scrollingElement, element.offsetTop, {
				duration: this.durationPerRouteDepth[depth]
			}, ease.inOutBounce);
		}
	}
    
	handleSecondRoutePart(slug, depth, element) {
		scroll.top(document.scrollingElement, element.offsetTop, {
			duration: this.durationPerRouteDepth[depth]
		}, ease.inOutBounce);
	}
    
	handleThirdRoutePart() {
        
	}
}

export default ScrollRouter;