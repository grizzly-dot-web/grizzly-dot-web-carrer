import scroll from 'scroll';

import { CmsProps, CmsState } from './ClientSideComponent';
import CmsRoutingComponent from './ClientSideRoutingComponent';

export default abstract class ScrollRoutingComponent<Props extends CmsProps<any>, State extends CmsState> extends CmsRoutingComponent<Props, State> {

    lastScrollY : null|number = null
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
        scroll.top(document.scrollingElement, this.ref.offsetTop, () => {
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