import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { NavProps } from './Components/Navigation';

import FrontendComponentManager from './FrontendComponentManager';
import NavigationRegistry from './Router/NavigationRegistry';

export default class Bootstrap {

    data : any
   
    appElement : HTMLElement;

    disabledAnchorTagsSelector = 'a:not(.reload)'

    get componentHandler() {
        return FrontendComponentManager.getInstance();
    }

    constructor(app : HTMLElement) {
        this.appElement = app;
        this.componentHandler.appElement = this.appElement;
    }

	init(navigations : NavProps[] = []): any {
        this.componentHandler.init();
        
        NavigationRegistry.init(navigations);
    }
    
    render(callback : (data : any) => React.ReactElement<any>|JSX.Element) {
        fetch('/compiled/data.json').then((response) => {
            if (response.ok) {
                return response.json().then((data) => {
                    this.data = data;
                    
                    ReactDOM.render(callback(data), this.appElement, () => {
                        NavigationRegistry.updateNavigations().then(() => {
                            this.componentHandler.startRouter();
                        });
                    });

                })
            }
        });
    }

} 