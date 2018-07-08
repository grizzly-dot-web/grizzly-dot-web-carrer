import * as React from 'react';

import Router from '../Router';
import CmsComponentHandler from '../CmsComponentHandler';
import CmsControlledComponent, { CmsState, CmsProps } from '../CmsControlledComponent';
import { NavigationLink } from './Navigation';

export interface CmsRoutingState extends CmsState {
    isActive: boolean
} 

export default abstract class CmsRoutingComponent<Props extends CmsProps<any>, State extends CmsRoutingState> extends CmsControlledComponent<Props, State> {
    
    abstract link() : NavigationLink
    abstract navigationId() : string|false
    abstract get ref() : HTMLElement|null

    constructor(props: Props, context?: any) {
        super(props, context);
        this.state = Object.assign(this.state, {
            isActive: false
        });
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
        console.log('entered: ', this.link().url);        
        this.enter();
        this.setState(Object.assign(
            this.state, {
                isActive: true
            }
        ));
    }

    dispatchLeave() {
        console.log('leave: ', this.link().url);        
        this.leave();
        this.setState(Object.assign(
            this.state, {
                isActive: false
            }
        ));
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