import AtomicComponent, { AtomicProps, AtomicState } from '../AtomicComponent/client';

import { NavigationLink } from '../../../../client/Router/Navigation';
import ComponentManager from '../../../../client/ComponentManager';
import NavigationRegistry from '../../../../client/Router/NavigationRegistry';


export interface AtomicRouteData {
    navigationId: string|false
    link: NavigationLink
}

export interface AtomicRoutingProps<Data extends AtomicRouteData = AtomicRouteData> extends AtomicProps<Data> {
}

export default abstract class AtomicRoutingComponent<Props extends AtomicRoutingProps = AtomicRoutingProps, State extends AtomicState = AtomicState>
                                    extends AtomicComponent<Props, State> {
    
    constructor(props: Props, context?: any) {
        super(props, context);
        this.state = Object.assign(this.state, {
            isActive: false
        });

        this.addNavigationLink();    
    }

    protected registerComponentToHandler() {
        ComponentManager.getInstance().addComponent(this, true);
    }

    addNavigationLink() {
        let id = this.props.data.navigationId;
        if (!id) {
            return;
        }

        NavigationRegistry.addLink(id, {
            ...this.props.data.link,
            ...{isActive: this.acitveStateCondition.bind(this)}
        });
    }

    dispatchEnter() {
        NavigationRegistry.updateNavigations();
        console.log('entered: ', this.props.data.link.url);        
        this.enter();
    }

    dispatchLeave() {
        console.log('leave: ', this.props.data.link.url);        
        this.leave();
    }

    abstract enter() : void;

    abstract leave() : void;
    
    acitveStateCondition(): boolean {
        let currentUrl = window.location.pathname;
        if (currentUrl === '') {
            currentUrl = '/';
        }
        return this.props.data.link.url === currentUrl;
    }

}