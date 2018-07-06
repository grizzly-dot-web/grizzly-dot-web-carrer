import * as React from 'react';
import ScrollRoutingComponent from "../Core/Router/ScrollRoutingComponent";
import { NavigationLink } from '../Core/Router/Navigation';
import Article from '../Core/Components/Article';


export default class Intro extends ScrollRoutingComponent<any, {}> {
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
        let children = this.renderChildren({
            'Article' : Article
        });

        return (
            <section ref={ref => this.ref}>
                {children}
            </section>
        );
    }

    enter(): void {
        throw new Error("Method not implemented.");
    }
    leave(): void {
        throw new Error("Method not implemented.");
    }
}