import ScrollWatcher from'./ScrollRouter/ScrollWatcher';
/*
class ScrollRouter {

	private _watcher : ScrollWatcher;

	options: any;

	durationPerRouteDepth: Array<number>

	constructor(options : any) {
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
	//	this.dispatch(window.location.pathname);
		
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
			console.log(e, type, key);
			
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
			this._watcher.scroll.top(document.scrollingElement, element.offsetTop, {
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
*/