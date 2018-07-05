import scroll from 'scroll';
import page from 'scroll-doc';
import ease from 'ease-component';

import AbstractRoutingComponent from "./AbstractRoutingComponent";

export default abstract class ScrollRoutingComponent<Props = {}, State = {}> extends AbstractRoutingComponent<Props, State> {
    

    hasScrolledOnce = false

    dispatchEnter() {
        if (this.hasScrolledOnce || this.ref == null)  {
            return;
        }
        
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        let scrollBottom = scrollTop + window.innerHeight;

        this._router.disableActiveDetection = true;
        console.log('scroll-start');
        let callback = () => {
            this._router.disableActiveDetection = false;
            this.hasScrolledOnce = true;
            console.log('scroll-end');        
        }
        scroll.top(page(), this.ref.offsetTop, callback)
           
        this.enter();
    }

    dispatchLeave() {
        this.hasScrolledOnce = false;
        this.leave();
    }

	enter(): void {
        console.log('enter: ', this.url);
	}
	
	leave(): void {
        console.log('leave: ', this.url);
	}

	acitveStateCondition(): boolean {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        let scrollBottom = scrollTop + window.innerHeight;
		if (this.ref == null) {
			return false;
		}

		if (
			scrollBottom >= this.ref.offsetTop &&
			scrollTop <= this.ref.offsetTop + this.ref.clientHeight
		) {
			return true;
        }
		
		return false;
	}
}