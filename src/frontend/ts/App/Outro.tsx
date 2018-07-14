import * as React from 'react';

import TimeQualityCostSwitch from './Components/TimeQualityCostSwitch';
import CmsMarkdown from '../Core/Components/CmsMarkdown';
import Intro from './Intro';

export default class Outro extends Intro {
    link() {
        return {
            url: '/serching',
            title: '',
            text: 'Meine Suche',
        };
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
            <div ref={ref => this.ref = ref} className={`outro`}>
                {
                   this.renderChildren({
                        'CmsMarkdown' : {
                            class: CmsMarkdown,
                            props: { classes: ['textarea_columns'] }
                        },
                    })
                }
            </div>
        );
    }
}