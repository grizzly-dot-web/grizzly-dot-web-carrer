import * as React from 'react';

import Router from '../Router';
import CmsComponentHandler from '../CmsComponentHandler';
import CmsControlledComponent, { CmsState, CmsProps } from '../CmsControlledComponent';
import { NavigationLink, NavState } from './Navigation';
import NavigationRegistry from './NavigationRegistry';

export default abstract class CmsRoutingComponent<Props extends CmsProps<any>, State extends CmsState> extends CmsControlledComponent<Props, State> {
    
    abstract get ref() : HTMLElement|null
    abstract navigationId() : string|false
    abstract link() : NavigationLink
    
    constructor(props: Props, context?: any) {
        super(props, context);
        this.state = Object.assign(this.state, {
            isActive: false
        });

        this.addNavigationLink();    
    }

    protected registerComponentToHandler() {
        this.handler.addComponent(this, true);
    }

    addNavigationLink() {
        let id = this.navigationId();
        if (!id) {
            return;
        }

        NavigationRegistry.addLink(id, this.link());
    }

    dispatchEnter() {               
        console.log('entered: ', this.link().url);        
        this.enter();
    }

    dispatchLeave() {
        console.log('leave: ', this.link().url);        
        this.leave();
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