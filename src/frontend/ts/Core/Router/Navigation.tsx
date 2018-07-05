import * as React from 'react';

export interface NavigationRegistry {
    [identifier:string] : Navigation
}

export interface NavigationLink {
    
    url: string

    title: string

    text: string|JSX.Element

    target?: string

    classes?: string[]
    
}

export class Navigation {

    /**
     * @param id identifies this navigation to get the navigation from the router in an component also as className setted 
     * @param classes additional class names for the rendered navigation
     * @param links rendered in anchor tags for the navigation
     * @param activeLinkClass would be added to an link if it is active
     */
    constructor(id : string, classes : string[] = [], links : NavigationLink[] = [], activeLinkClass = 'is-active') {
        this.identifier = id;
        this.links = links;
        this.classes = classes;
    }

    links : NavigationLink[]
    
    classes: string[]

    identifier : string

    render() {
        let renderedLinks = [];
        for (let link of this.links) {
            let classNames : string[] = [];
            if (link.classes) {
                classNames = link.classes;
            }

            renderedLinks.push(<a key={link.url} className={classNames.join(' ')} title={link.title} href={link.url} target={link.target}>{link.text}</a>);
        }

        return (
            <nav className={`${this.identifier} ${this.classes.join(' ')}`}>
                {renderedLinks}
            </nav>
        );
    }
}