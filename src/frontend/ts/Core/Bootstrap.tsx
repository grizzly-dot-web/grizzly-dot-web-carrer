import * as React from 'react';
import * as ReactDOM from 'react-dom';

import App from '../App';
import Router from '../Core/Router';

export default class Bootstrap {
    
    disabledAnchorTagsSelector = 'a:not(.reload)'
    
    appElement : HTMLElement;

    get router() {
        return Router.getInstance();
    }

    constructor(app : HTMLElement) {
        this.appElement = app;
        this.router.appElement = this.appElement;
    }

	render(): any {
        fetch('/data/career.json').then((response) => {
            if (response.ok) {
                response.json().then((data) => {
                    ReactDOM.render(
                        <App data={data} />,
                        this.appElement
                    );

                    this.router.detectActiveComponentByUrl();
                    this.router.setupAnchorTagClickHandling(this.disabledAnchorTagsSelector);
                })
            }
        });
    }


}