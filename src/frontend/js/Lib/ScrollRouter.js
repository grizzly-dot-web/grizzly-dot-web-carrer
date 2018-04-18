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

		this.dispatch(window.location.pathname);
		this._watcher.on(document.scrollingElement, () => {
			this.getNextRoute().then((route) => {
				if (route instanceof Route) {
					this.goto(route);
				}
			});

			return false;
		});

		window.onpopstate = (e) => {
			this.dispatch();
			e.preventDefault();
		};
	}

	dispatch(pathname) {
		try {
			super.dispatch(pathname).then(
				() => {
					console.log('successfull dispatched');
				},
				() => {
					console.log('unsuccessfull dispatched');
				}
			);
		} catch(e) {
			//TODO: bring this message to frontend 
			console.log(`404 Sry but your page could not be found //TODO: bring this message to frontend`);
			throw e;
		}
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