import * as React from 'react';
import ScrollRoutingComponent from "../Core/Router/ScrollRoutingComponent";
import { NavigationLink } from '../Core/Router/Navigation';
import Article from '../Core/Components/Article';
import { CmsProps, CmsState } from '../Core/CmsControlledComponent';



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
            <section ref={ref => this.ref = ref} className={`intro`}>
                {
                    this.renderChildren({
                        'Article' : Article
                    })
                }
            </section>
        );
    }

    enter(): void {
        this.appElement.classList.add('header__bg-active');
    }
    leave(): void {
        this.appElement.classList.remove('header__bg-active');
    }
}