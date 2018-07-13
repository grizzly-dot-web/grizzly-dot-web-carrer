import * as React from 'react';
import NavigationRegistry from './NavigationRegistry';

export interface NavigationLink {
    
    url: string

    title: string

    text: string|JSX.Element

    links?: NavigationLink[] 

    target?: string

    classes?: string[]
    
    isActive?: (() => boolean)

    callback?: ((e : React.MouseEvent<HTMLAnchorElement>) => void)
    
}

export interface NavProps {
    identifier : string
    links? : NavigationLink[]
    classes? : string[]
    hasBurgerMenu? : boolean
    activeLinkClass? : string
}

export interface NavState {
    links : NavigationLink[]
    classes : string[]
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
                <div ref={(ref) => this.burgerMenuRef = ref} onClick={() => this.handleBurgerClick()} className="burger-icon">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            );
        }

        return (
            <nav ref={(ref) => this.ref = ref} className={`${this.props.identifier} ${this.state.classes.join(' ')}`}>
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

            if (link.isActive && link.isActive() == true) {
                classNames.push(this.state.activeLinkClass);
            }

            let children = null;
            if (link.links) {
                children = this.renderLinks(link.links)
            }

            let click = {};
            if (link.callback) {
                click = { onClick: link.callback}
            }

            renderedLinks.push(
                <li key={link.url} className={classNames.join(' ')}>
                    <a {...click} title={link.title} href={link.url} target={link.target}>{link.text}</a>
                </li>
            );
        }

        return <ul>{renderedLinks}</ul>;
    }

    componentDidMount() {
        NavigationRegistry.addInstance(this.props.identifier, this);
    }

    handleLinkClick(e : React.MouseEvent<HTMLAnchorElement>, link : NavigationLink) {
    }

    handleBurgerClick() {
        if (!this.burgerMenuRef || !this.ref) {
            throw new Error('burgerMenuRef or ref is not assigned')
        }

        let app = document.querySelector('#app') as HTMLElement;
        app.classList.toggle(`navigation-${this.props.identifier}__is-active`)
    }

}