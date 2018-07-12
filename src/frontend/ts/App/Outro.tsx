import * as React from 'react';

import TimeQualityCostSwitch from './Components/TimeQualityCostSwitch';
import Textarea from '../Core/Components/Textarea';
import Intro from './Intro';

export default class Outro extends Intro {
    link() {
        return {
            url: '/serching',
            title: '',
            text: 'Meine Suche',
        };
    }
    navigationId(): string | false {
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
                        'Textarea' : {
                            class: Textarea,
                            props: { classes: ['textarea_columns'] }
                        },
                    })
                }
            </div>
        );
    }
}