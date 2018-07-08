import scroll from 'scroll';
import page from 'scroll-doc';
import ease from 'ease-component';

import CmsRoutingComponent, { CmsRoutingState } from "./AbstractRoutingComponent";
import { CmsProps } from '../CmsControlledComponent';

export default abstract class ScrollRoutingComponent<Props extends CmsProps<any>, State extends CmsRoutingState> extends CmsRoutingComponent<Props, State> {

    lastScrollTop : null|number = null
    hasScrolledOnce = false

    constructor(props: any, context?: any) {
        super(props, context);
    }

    dispatchEnter() {
        if (this.ref == null) {
            throw new Error('ref is not defined');
        }

        if (this.acitveStateCondition())  {
            return super.dispatchEnter();
        }
        
        this.handler.disableComponentConditionRouting();
        
        scroll.top(page(), this.ref.offsetTop, () => {
            this.handler.enableComponentConditionRouting();
            this.hasScrolledOnce = true;
            return super.dispatchEnter();
        });
    }

	acitveStateCondition(): boolean {
        let scrollTop = window.scrollY;
        let scrollBottom = scrollTop + window.innerHeight;
		if (this.ref == null) {
            throw new Error('ref is not defined');
		}

        let compTop = this.ref.offsetTop;
        let compBottom = this.ref.offsetTop + this.ref.offsetHeight;

        //scroll down - is active when not upper viewport position is not in between component 
        return scrollTop <= compBottom && scrollTop >= compTop
	}
}