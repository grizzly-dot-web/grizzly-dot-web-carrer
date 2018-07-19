import * as React from 'react';
import * as ReactDOM from 'react-dom';

import CmsComponentHandler from './CmsComponentHandler';
import { NavState } from './Router/Navigation';


export interface ChildComponentConfig {
    [className:string] : { class: any, props? : any }//new (props : CmsComponentProps) => CmsControlledComponent<CmsComponentProps, CmsState>
}

export interface ChildComponentData {
    [className:string] : {
        className : string 
        props : CmsProps<any>        
    }
}

export interface CmsProps<Data> {
    data? : Data
    childrenInfo? : {[region:string] : ChildComponentData[]}
}

export interface CmsState {
    navigations?: {[className:string] : React.ReactElement<NavState>[]}
}

export default class CmsControlledComponent<Props extends CmsProps<any> = CmsProps<any>, State extends CmsState = CmsState> extends React.Component<Props, State> {
    

    protected get currentUser() {
        return this.handler.currentUser;
    }

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

    protected renderChildren(possibleChildComps : ChildComponentConfig, region : string = 'default') {
        let info : ChildComponentData[] = [];
        
        if (this.props.data && this.props.data.childrenInfo && this.props.data.childrenInfo.hasOwnProperty(region)) {
            info = this.props.data.childrenInfo[region] as ChildComponentData[];
        }

        if (this.props.childrenInfo && this.props.childrenInfo.hasOwnProperty(region)) {
            info = this.props.childrenInfo[region] as ChildComponentData[];
        }

        let counter = 0;
        let children = [];
        for (let compData of info) {
            counter++;
            
            let config =  possibleChildComps[compData.className as any]

            if (!config) {
                throw new Error(`Unsupported Component "${compData.className}" in "${region}" region`);
            }


            let props = {
                key: counter.toString(),
                ...compData.props,
                ...config.props
            }

            let ChildComps = config.class;
            children.push(<ChildComps key={'child'+ counter} {...props} />);
        }

        return children as React.ReactElement<ChildComponent>[];
    } 
}

export class ChildComponent extends CmsControlledComponent {
    className : string

    constructor(props: CmsProps<any>, className : string, context?: any) {
        super(props, context);

        this.className = className;
    }
}