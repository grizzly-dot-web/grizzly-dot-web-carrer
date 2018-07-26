import * as React from 'react';

import scroll from 'scroll';
import scrollDoc from 'scroll-doc';
import AtomicRoutingComponent from '../Abstract/AtomicRoutingComponent/client';
import ComponentManager from '../../../client/ComponentManager';


export default abstract class AtomicScrollRouting extends AtomicRoutingComponent {

    ref : HTMLElement | null = null;

    lastScrollY : null|number = null
    hasScrolledOnce = false

    constructor(props: any, context?: any) {
        super(props, context);
    }

    render() {
        return (
            <div ref={ ref => this.ref = ref} className="atomicCCMS_Region">
                {this.props.children}
            </div>
        );
    }

    dispatchEnter() {
        if (this.ref == null) {
            throw new Error('ref is not defined');
        }

        if (this.acitveStateCondition())  {
            return super.dispatchEnter();
        }
        
        ComponentManager.getInstance().disableComponentConditionRouting();
        scroll.top(scrollDoc(), this.ref.offsetTop, () => {
            ComponentManager.getInstance().enableComponentConditionRouting();
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