import * as React from 'react';
import AtomicComponent, { AtomicProps } from '../Abstract/AtomicComponent/client';

export interface RegionData<Props = AtomicProps> {
    className: string
    props : Props
    children? : RegionData
}

export interface RegionProps extends AtomicProps<RegionData[]> {
    name: string
    childrenConfig? : any
}

export interface ChildrenConfig<Props = AtomicProps> { 
    [className:string] : {
        class : any
        props? : Props
        beforeRender? : (type : any, props : AtomicProps) => void
    }
};

export class AtomicRegion extends AtomicComponent<RegionProps> {
    

    render() {
        return (
            <div className="atomicCCMS_Region">
                {this.renderChildren}
            </div>
        );
    }

    renderChildren() {
        let counter = 0;
        let children = [];
        let childConfig : ChildrenConfig = this.props.childrenConfig;
        
        for (let compData of this.props.data) {
            counter++;
            
            let config =  childConfig[compData.className as any]

            if (!config) {
                throw new Error(`Unsupported Component "${compData.className}" in "${this.props.name}" region`);
            }


            let props : AtomicProps = Object.assign(compData.props, config.props);

            let ChildComps = config.class;

            if  (config.beforeRender) {
                config.beforeRender(config.class, props);
            }

            children.push(<ChildComps key={'child'+ counter} {...props} />);
        }

        return children as React.ReactElement<AtomicComponent>[];
    }
}
