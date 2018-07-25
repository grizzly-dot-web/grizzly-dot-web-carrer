import scroll from 'scroll';
import scrollDoc from 'scroll-doc';

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
        scroll.top(scrollDoc(), this.ref.offsetTop, () => {
            this.handler.enableComponentConditionRouting();
            this.hasScrolledOnce = true;
            return super.dispatchEnter();
        });
    }

	acitveStateCondition(): boolean {
        let scrollTop = window.scrollY;
		if (this.ref == null) {
            throw new Error('ref is not defined');
        }
        
        let compStyles =  window.getComputedStyle(this.ref);
        
        let elementHeight = this.ref.clientHeight;

        let marginBottom = parseInt(compStyles.marginBottom || '0');
        let marginTop = parseInt(compStyles.marginTop || '0');
        let compTop = this.ref.offsetTop + marginTop;
        let compBottom = this.ref.offsetTop + elementHeight + marginBottom;

        //scroll down - is active when upper viewport position is not in between component 
        return scrollTop <= compBottom && scrollTop >= compTop
	}
}