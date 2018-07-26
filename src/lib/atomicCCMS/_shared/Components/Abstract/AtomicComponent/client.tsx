import * as React from 'react';
import ComponentManager from '../../../../client/ComponentManager';


export interface AtomicProps<Data = {}> {
    data: Data
}

export interface AtomicState {
}

export default abstract class AtomicComponent<Props extends AtomicProps = AtomicProps, State extends AtomicState = AtomicState> extends React.Component<Props, State> {

    protected get workWithUser() {
        return ComponentManager.getInstance().currentUser;
    }

    protected fetch(route : string, req? : RequestInit) {
        return ComponentManager.getInstance().fetch(route, req)
    }

    constructor(props: Props, context?: any) {
        super(props, context);
        this.state = {} as Readonly<State>;
        
        this.registerComponentToHandler();
    }

    protected registerComponentToHandler() {
        ComponentManager.getInstance().addComponent(this);
    }
    
    protected get appElement() {
        return ComponentManager.getInstance().appElement as HTMLElement;
    }
}