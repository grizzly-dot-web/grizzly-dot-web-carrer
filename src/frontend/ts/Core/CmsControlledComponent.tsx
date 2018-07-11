import * as React from 'react';
import CmsComponentHandler from './CmsComponentHandler';
import { NavigationRegistry } from './Router/Navigation';


export interface ChildComponentConfig {
    [className:string] : { class: any, props? : any }//new (props : CmsComponentProps) => CmsControlledComponent<CmsComponentProps, CmsState>
}

export interface ChildComponentData {
    [className:string] : CmsProps<any>//new (props : CmsComponentProps) => CmsControlledComponent<CmsComponentProps, CmsState>
}

export interface CmsProps<Data> {
    className : string
    key? : string
    data? : Data
    childrenInfo? : {[region:string] : ChildComponentData}
}

export interface CmsState {
    navigationRegistry : NavigationRegistry|null
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

    protected renderChildren(possibleChildComps : ChildComponentConfig, region : string = 'default') {
        let info = null;
        
        if (this.props.data && this.props.data.childrenInfo && this.props.data.childrenInfo.hasOwnProperty(region)) {
            info = this.props.data.childrenInfo[region] as ChildComponentData;
        }

        if (this.props.childrenInfo && this.props.childrenInfo.hasOwnProperty(region)) {
            info = this.props.childrenInfo[region] as ChildComponentData;
        }

        if (!info) {
            return null;
        }

        let children = [];
        let counter = 0;
        for (let compClassName in info) {
            counter++;
            
            let props = info[compClassName];
            let config =  possibleChildComps[props.className]

            if (!config) {
                throw new Error(`Unsupported Component "${info[compClassName].className}" in "${region}" region`);
            }

            let ChildComps = config.class;
            info[compClassName].key = counter.toString(); 
            let comp = new ChildComps(Object.assign(props, config.props)) as CmsControlledComponent<Props, State>;
            children.push(comp.render()); 
        }

        return children;
    } 
}