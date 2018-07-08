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
        console.log('entered: ', this.link().url);        
    }

    dispatchLeave() {       ;
        this.leave();
        console.log('leave: ', this.link().url);        
    }

    abstract enter() : void;

    abstract leave() : void;
    
    acitveStateCondition(): boolean {
        let currentUrl = window.location.pathname;
        if (currentUrl === '') {
            currentUrl = '/';
        }
        return this.link().url === currentUrl;
    }

}