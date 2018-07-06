import * as React from 'react';

import Router from '../Router';
import CmsComponentHandler from '../CmsComponentHandler';
import CmsControlledComponent, { CmsState, CmsProps } from '../CmsControlledComponent';
import { NavigationLink } from './Navigation';

export default abstract class CmsRoutingComponent<Props extends CmsProps<any>, State extends CmsState> extends CmsControlledComponent<Props, State> {
    
    abstract link() : NavigationLink
    abstract navigationId() : string|false
    abstract get ref() : HTMLElement|null

    constructor(props: Props, context?: any) {
        super(props, context);
        this.addNavigationLink();    
    }

    _register() {
        this.handler.addComponent(this, true);
    }

    addNavigationLink() {
        let id = this.navigationId();
        if (!id) {
            return;
        }

        this.handler.addLinkToNavigation(id, this.link());
    }

    dispatchEnter() {       
        this.enter();
    }

    dispatchLeave() {       ;
        this.leave();
    }

    abstract enter() : void;

    abstract leave() : void;
    
    acitveStateCondition(): boolean {
        return this.link().url === window.location.pathname;
    }

}