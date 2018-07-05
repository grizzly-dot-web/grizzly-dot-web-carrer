import * as React from 'react';
import CmsComponentHandler from './CmsComponentHandler';
import { NavigationRegistry } from './Router/Navigation';

export interface CmsState {
    navigationRegistry : NavigationRegistry
}

export default class CmsControlledComponent<Props = {}, CmsState = {}> extends React.Component<Props, CmsState> {

    constructor(props: Props, context?: any) {
        super(props, context);
        this._register();
    }
    
    _register() {
        this.handler.addComponent(this);
    }

    protected get handler() : CmsComponentHandler {
        return CmsComponentHandler.getInstance();
    }
    
    get appElement() {
        return this.handler.appElement as HTMLElement;
    }
}