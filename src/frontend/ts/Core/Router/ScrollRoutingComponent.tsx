import scroll from 'scroll';
import page from 'scroll-doc';
import ease from 'ease-component';

import CmsRoutingComponent from "./AbstractRoutingComponent";

export default abstract class ScrollRoutingComponent<Props = {}, State = {}> extends CmsRoutingComponent<Props, State> {

    hasScrolledOnce = false

    dispatchEnter() {
        if (this.hasScrolledOnce || this.ref == null)  {
            return;
        }
        
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        let scrollBottom = scrollTop + window.innerHeight;

        this.handler.disableComponentConditionRouting();
        console.log('scroll-start');
        let callback = () => {
            this.handler.enableComponentConditionRouting();
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