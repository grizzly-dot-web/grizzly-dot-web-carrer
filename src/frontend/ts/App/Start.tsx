import * as React from 'react';

import Content from '../Core/Components/Content';
import Introduction from './Introduction';

export default class Start extends Introduction {
    
    link() { 
        return {
            url: '/',
            title: '',
            text: 'Start',
        }
    }
    navigationId() {
       return 'main';
    }

    ref: HTMLElement | null;

	constructor(props : any) {
        super(props);
        
        this.ref = null;
    }
    
    render() {
        return (
            <div ref={ref => this.ref = ref} className={`start`}>
                {
                   this.renderChildren({
                        'Content' : {
                            class: Content,
                            props: { 
                                classes: ['textarea'],
                                allowedHeadlineLevel: 2
                            }
                        },
                    })
                }
            </div>
        );
    }
}