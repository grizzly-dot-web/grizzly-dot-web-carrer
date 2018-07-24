import * as React from 'react';

import Content from '../Core/Components/Content';
import Introduction from './Start';

export default class Imprint extends Introduction {
    
    link() { 
        return {
            url: '/imprint',
            title: '',
            text: 'Impressum',
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
        this.workWithUser.then(
            (user) => {
                console.log(user);
            },
            (user) => {
                console.log(user);
            }
        )

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