import * as React from 'react';

import Router from '../Router';

export default abstract class AbstractRoutingComponent<Props = {}, State = {}> extends React.Component<Props, State> {

    protected get _router() : Router {
        return Router.getInstance();
    }
    
    abstract get url() : string;
    abstract get ref() : HTMLElement|null

    get appElement() {
        return this._router.appElement as HTMLElement;
    }

    componentDidMount() {
        this._router.addComponent(this);
    }

    dispatchEnter() {       
        this.enter();
    }

    dispatchLeave() {       
        this.leave();
    }

    abstract enter() : void;

    abstract leave() : void;

    abstract acitveStateCondition() : boolean

}