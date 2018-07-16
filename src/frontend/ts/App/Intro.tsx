import * as React from 'react';
import ScrollRoutingComponent from "../Core/Router/ScrollRoutingComponent";
import { NavigationLink } from '../Core/Router/Navigation';
import { CmsProps, CmsState } from '../Core/CmsControlledComponent';
import TimeQualityCostSwitch from './Components/TimeQualityCostSwitch';
import Content from '../Core/Components/Content';

export interface IntroProps extends CmsProps<undefined> {
}
export interface IntroState extends CmsState {
}

export default class Intro extends ScrollRoutingComponent<IntroProps, IntroState> {
    
    link() { 
        return {
            url: '/',
            title: '',
            text: 'Start',
        }
    }
    navigationId() { return 'main' };
    ref: HTMLElement | null;

    constructor(props : any) {
        super(props);
        
        this.ref = null;
    }
    
    render() {
        return (
            <div ref={ref => this.ref = ref} className={`intro`}>
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

    enter(): void {
        this.appElement.classList.add('header__bg-active');
		this.appElement.classList.remove('history__is-active');
		this.appElement.classList.remove('header__right-dark');
    }
    leave(): void {
        this.appElement.classList.remove('header__bg-active');
    }
}