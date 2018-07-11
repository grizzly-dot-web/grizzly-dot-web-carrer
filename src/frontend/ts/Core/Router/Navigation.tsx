import * as React from 'react';

export interface NavigationRegistry {
    [identifier:string] : Navigation
}

export interface NavigationLink {
    
    url: string

    title: string

    text: string|JSX.Element

    target?: string

    classes?: string[],

    links?: NavigationLink[]
    
}

export class Navigation {

    /**
     * @param id identifies this navigation to get the navigation from the router in an component also as className setted 
     * @param classes additional class names for the rendered navigation
     * @param links rendered in anchor tags for the navigation
     * @param activeLinkClass would be added to an link if it is active
     */
    constructor(id : string, classes : string[] = [], links : NavigationLink[] = [], burgerMenu : boolean = true, activeLinkClass = 'is-active') {
        this.identifier = id;
        this.links = links;
        this.classes = classes;
        this.hasBurgerMenu = burgerMenu;
    }

    links : NavigationLink[]
    
    classes: string[]

    identifier : string

    hasBurgerMenu : boolean

    render() {
        let renderedLinks = [];

        let burgerMenu = null;
        if (this.hasBurgerMenu) {
            burgerMenu = (
                <div className="burger-icon">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            );
        }

        return (
            <nav className={`${this.identifier} ${this.classes.join(' ')}`}>
                {burgerMenu}
                {this.renderLinks(this.links)}
            </nav>
        );
    }

    renderLinks(links : NavigationLink[]) {
        let renderedLinks = [];
        for (let link of links) {
            let classNames : string[] = [];
            if (link.classes) {
                classNames = link.classes;
            }

            let children = null;
            if (link.links) {
                children = this.renderLinks(link.links)
            }

            renderedLinks.push(
                <li key={link.url} className={classNames.join(' ')}>
                    <a title={link.title} href={link.url} target={link.target}>{link.text}</a>
                </li>
            );
        }

        return <ul>{renderedLinks}</ul>;
    }
}