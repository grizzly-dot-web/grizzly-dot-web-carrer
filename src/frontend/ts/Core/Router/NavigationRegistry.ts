import * as React from 'react';
import { NavigationLink, NavProps, NavState, Navigation } from "../Components/Navigation";

export interface NavRegistryItem {
    instance? : Navigation
    props: NavProps
}

export default class NavigationRegistry {

    private static _navigationRegistry : {[id:string] : NavRegistryItem} = {}

    static init(navigations : NavProps[]) {
        for (let props of navigations) {
            NavigationRegistry.add(props.identifier, props);
        }
    }

    static add(id : string, props : NavProps) {
        if (NavigationRegistry._navigationRegistry.hasOwnProperty(id)) {
            throw new Error(`Navigation with id ${id} already exists!`);
        }
        NavigationRegistry._navigationRegistry[id] = {
            props: props
        }
    }

    static get(id : string) {
        if (!NavigationRegistry._navigationRegistry.hasOwnProperty(id)) {
            throw new Error(`Navigation with id ${id} does not exists!`);
        }

        let item = NavigationRegistry._navigationRegistry[id];

        return item;
    }

    static addInstance(id : string, nav : Navigation) {
        NavigationRegistry.get(id).instance = nav; 
    }

    static addLink(id : string, link : NavigationLink) {
        let links = NavigationRegistry.get(id).props.links;
        if (!links) {
            links = [];
        }

        links.push(link);

        NavigationRegistry.get(id).props = { 
            ...NavigationRegistry.get(id).props,
            ...{ links: links}
        } as NavProps;
    }

    static updateState(id : string, link : NavigationLink) {
        let links = NavigationRegistry.get(id).props.links;
        if (!links) {
            links = [];
        }

        links.push(link);

        NavigationRegistry.get(id).props = { 
            ...NavigationRegistry.get(id).props,
            ...{ links: links}
        } as NavProps;
    }

    static updateNavigations() {
        return new Promise((resolve) => {
            let changedStateCount = 0; 
            for (let id in NavigationRegistry._navigationRegistry) {
                let regItem = NavigationRegistry.get(id);

                if (regItem.instance) {
                    regItem.instance.setState(Object.assign(
                        regItem.instance.state,
                        regItem.props,
                    ), () => {
                        changedStateCount++;

                        if (changedStateCount == Object.keys(NavigationRegistry._navigationRegistry).length) {
                            resolve();
                        }
                    });
                }
            }
        })
    }

}