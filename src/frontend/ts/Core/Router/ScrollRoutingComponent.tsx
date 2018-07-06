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
        
        this.handler.disableComponentConditionRouting();
        console.log('scroll-start');
        let callback = () => {
            this.handler.enableComponentConditionRouting();
            this.hasScrolledOnce = true;
            console.log('scroll-end');        
            this.enter();            
        }
        scroll.top(page(), this.ref.offsetTop, callback);
    }

    dispatchLeave() {
        this.hasScrolledOnce = false;
        this.leave();
    }

	acitveStateCondition(): boolean {
        let scrollTop = window.scrollY;
        let scrollBottom = scrollTop + window.innerHeight;
		if (this.ref == null) {
			return false;
		}

        let compTop = this.ref.offsetTop;
        let compBottom = this.ref.offsetTop + this.ref.offsetHeight;

		if (
			scrollBottom >= compTop &&
            scrollTop <=  compBottom &&
            super.acitveStateCondition()
		) {
			return true;
        }
		
		return false;
	}
}