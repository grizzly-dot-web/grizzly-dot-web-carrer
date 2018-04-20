import 'scrollingelement';

import scroll from 'scroll';
import ease from 'ease-component';

import Router from './ScrollRouter/Router';
import Route from './ScrollRouter/Route';
import ScrollWatcher from'./ScrollRouter/ScrollWatcher';

class ScrollRouter extends Router {
	constructor(options) {
		super(options);
		this.durationPerRouteDepth = [
			0,
			500,
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
		this.dispatch(window.location.pathname);
		
		let changeRoute = (route) => {
			console.log('[NEXT_ROUTE] start');
			if (route instanceof Route) {
				this.goto(route, {
					resolve: () => {
						console.log('[NEXT_ROUTE] finish');
					}, 
					reject: () => {
						console.log('[NEXT_ROUTE] reject');
					}
				});
			}
		};
		this._watcher.on(document.scrollingElement, (e, type, key) => {
			if (type !== ScrollWatcher.EventType.keydown) {
				return;
			}

			switch(key) {
				case ScrollWatcher.Key.Down || ScrollWatcher.Key.PageDown:
					this.getNextRoute().then(changeRoute);
					break;
				case ScrollWatcher.Key.Up || ScrollWatcher.Key.PageUp:
					this.getPreviousRoute().then(changeRoute);
					break;
			}

			return false;
		});
	}

	handleFirstRoutePart(slug, depth, element) {
		console.log('dispatch first part');
		if (element && !element.classList.contains('is-active')) {
			scroll.top(document.scrollingElement, element.offsetTop, {
				duration: this.durationPerRouteDepth[depth]
			}, ease.inOutBounce);
		}
	}
    
	handleSecondRoutePart(slug, depth, element) {
		console.log('dispatch second part');
		scroll.top(document.scrollingElement, element.offsetTop, {
			duration: this.durationPerRouteDepth[depth]
		}, ease.inOutBounce);
	}
    
	handleThirdRoutePart() {
		console.log('dispatch third part');        
	}
}

export default ScrollRouter;