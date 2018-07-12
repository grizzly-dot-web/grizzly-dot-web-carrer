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


/**
 * @param id identifies this navigation to get the navigation from the router in an component also as className setted 
 * @param classes additional class names for the rendered navigation
 * @param links rendered in anchor tags for the navigation
 * @param activeLinkClass would be added to an link if it is active
 */
export interface NavProps {
    id : string,
    classes? : string[]
    links? : NavigationLink[]
    hasBurgerMenu? : boolean, 
    activeLinkClass? : string
}
export interface NavState {
    classes : string[]
    links : NavigationLink[]
    hasBurgerMenu : boolean, 
    activeLinkClass : string
}

export class Navigation extends React.Component<NavProps, NavState> {

    ref : HTMLElement|null
    burgerMenuRef : HTMLElement|null

    constructor(props : NavProps) {
        super(props);


        this.ref = null;
        this.burgerMenuRef = null;

        this.state = {
            classes: this.props.classes || [],
            links: this.props.links || [],
            hasBurgerMenu: this.props.hasBurgerMenu || true,
            activeLinkClass: this.props.activeLinkClass || 'is-active',
        }
    }

    render() {
        let renderedLinks = [];

        let burgerMenu = null;
        if (this.state.hasBurgerMenu) {
            burgerMenu = (
                <div ref={(ref) => this.burgerMenuRef = ref} onClick={() => this.handleBurgerClick} className="burger-icon">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            );
        }

        return (
            <nav  ref={(ref) => this.ref = ref} className={`${this.props.id} ${this.state.classes.join(' ')}`}>
                {burgerMenu}
                {this.renderLinks(this.state.links)}
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
                    <a onClick={() => this.handleLinkClick()} title={link.title} href={link.url} target={link.target}>{link.text}</a>
                </li>
            );
        }

        return <ul>{renderedLinks}</ul>;
    }

    componentDidMount() {
        console.log('navigation', this.props.id, 'mounted');
    }

    handleLinkClick() {
        
    }

    handleBurgerClick() {
        if (!this.burgerMenuRef) {
            throw new Error('burgerMenuRef is not assigned')
        }

        let app = document.querySelector('#app') as HTMLElement;
        
        app.classList.toggle(`navigation-${this.props.id}__is-active`)
    }

}