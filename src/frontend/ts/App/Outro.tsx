import * as React from 'react';

import Content from '../Core/Components/Content';
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
                        'Content' : {
                            class: Content,
                            props: { 
                                classes: ['textarea_columns'],
                                allowedHeadlineLevel: 2
                            }
                        },
                    })
                }
            </div>
        );
    }
}