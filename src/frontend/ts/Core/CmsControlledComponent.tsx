import * as React from 'react';
import * as ReactDOM from 'react-dom';

import CmsComponentHandler from './CmsComponentHandler';
import NavigationRegistry from './Router/NavigationRegistry';
import { NavState } from './Router/Navigation';

export interface CmsProps<Data> {
    class : string
    key? : string
    data? : Data
    childrenInfo? : {[className:string] : CmsProps<Data>}
}

export interface CmsState {
    navigations?: {[className:string] : React.ReactElement<NavState>[]}
}

export interface ChildComponents {
    [className:string] : any//new (props : CmsComponentProps) => CmsControlledComponent<CmsComponentProps, CmsState>
}

export default abstract class CmsControlledComponent<Props extends CmsProps<any>, State extends CmsState> extends React.Component<Props, State> {
    
    constructor(props: Props, context?: any) {
        super(props, context);
        this.state = {} as Readonly<State>;
        
        this.registerComponentToHandler();
    }

    protected registerComponentToHandler() {
        this.handler.addComponent(this);
    }

    protected get handler() : CmsComponentHandler {
        return CmsComponentHandler.getInstance();
    }
    
    public get appElement() {
        return this.handler.appElement as HTMLElement;
    }

    protected renderNavigation(id : string) {
        if (!this.state.navigations) {
            throw new Error(`navigation property must exist in state`)
        }
        if (!this.state.navigations.hasOwnProperty(id)) {
            throw new Error(`navigation with key: ${id} did not exists`)
        }

        return this.state.navigations[id];
    }

    protected renderChildren(possibleChildComps : ChildComponents) {
        let info = this.props.childrenInfo;
        if (!info) {
            throw new Error('Component have no children / you have to specify it in the json')
        }

        let counter = 0;
        let children = [];
        for (let compClassName in info) {
            counter++;
            
            let ChildComps = possibleChildComps[info[compClassName].class];
            if (!ChildComps) {
                throw new Error(`Unsupported Component`);
            }

            info[compClassName].key = counter.toString();
            let comp = new ChildComps(info[compClassName]) as CmsControlledComponent<Props, State>;
            children.push(comp.render()); 
        }

        return children;
    } 
}