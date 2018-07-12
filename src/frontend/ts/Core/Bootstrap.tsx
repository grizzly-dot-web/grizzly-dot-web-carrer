import * as React from 'react';
import * as ReactDOM from 'react-dom';

import App from '../App';
import Router from '../Core/Router';
import { Navigation, NavigationRegistry } from './Router/Navigation';
import CmsComponentHandler from './CmsComponentHandler';

export default class Bootstrap {
    disabledAnchorTagsSelector = 'a:not(.reload)'
    
    appElement : HTMLElement;

    get componentHandler() {
        return CmsComponentHandler.getInstance();
    }

    constructor(app : HTMLElement) {
        this.appElement = app;
        this.componentHandler.appElement = this.appElement;
    }

    public registerNavigations(navigations : Navigation[]) {
        let registry : NavigationRegistry = {};
        for (let nav of navigations) {
            registry[nav.props.id] = nav;
        }

        this.componentHandler.setNavigationRegistry(registry);
    }
    
	init(): any {
        this.componentHandler.init();
        this.render().then(() => {
            this.componentHandler.startRouter();
        });
	}

	render(): any {
        return fetch('/data/career.json').then((response) => {
            if (response.ok) {
                return response.json().then((data) => {
                    ReactDOM.render(
                        <App data={data} />,
                        this.appElement
                    );
                })
            }
        });
    }


}