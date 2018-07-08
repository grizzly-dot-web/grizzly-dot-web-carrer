import * as React from 'react';
import CmsComponentHandler from './CmsComponentHandler';
import { NavigationRegistry } from './Router/Navigation';

export interface CmsProps<Data> {
    class : string
    key? : string
    data? : Data
    childrenInfo? : {[className:string] : CmsProps<Data>}
}

export interface CmsState {
    navigationRegistry : NavigationRegistry|null
}

export interface ChildComponents {
    [className:string] : any//new (props : CmsComponentProps) => CmsControlledComponent<CmsComponentProps, CmsState>
}

export default class CmsControlledComponent<Props extends CmsProps<any>, State extends CmsState> extends React.Component<Props, State> {


    constructor(props: Props, context?: any) {
        super(props, context);
        this.state = {
            navigationRegistry: null
        } as Readonly<State>;
        
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

    protected renderChildren(possibleChildComps : ChildComponents) {
        let info = this.props.childrenInfo;
        if (!info) {
            throw new Error('Component have no children / you have to specify it in the json')
        }

        let children = [];
        let counter = 0;
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