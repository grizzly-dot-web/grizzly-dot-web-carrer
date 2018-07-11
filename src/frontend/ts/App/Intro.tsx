import * as React from 'react';
import ScrollRoutingComponent from "../Core/Router/ScrollRoutingComponent";
import { NavigationLink } from '../Core/Router/Navigation';
import Article from '../Core/Components/Article';
import { CmsProps, CmsState } from '../Core/CmsControlledComponent';
import TimeQualityCostSwitch from './Components/TimeQualityCostSwitch';
import Textarea from '../Core/Components/Textarea';



export interface IntroProps extends CmsProps<undefined> {
}
export interface IntroState extends CmsState {
	visibleExperienceLevel : number
}

export default class Intro extends ScrollRoutingComponent<IntroProps, IntroState> {
    link(): NavigationLink {
        return {
            url: '/',
            title: '',
            text: 'Start',
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
            <div ref={ref => this.ref = ref} className={`intro`}>
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

    enter(): void {
        this.appElement.classList.add('header__bg-active');
		this.appElement.classList.remove('history__is-active');
		this.appElement.classList.remove('header__right-dark');
    }
    leave(): void {
        this.appElement.classList.remove('header__bg-active');
    }
}