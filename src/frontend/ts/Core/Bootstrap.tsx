import * as React from 'react';
import * as ReactDOM from 'react-dom';

import Router from '../Core/Router';

import { Navigation, NavProps } from './Router/Navigation';

import CmsComponentHandler from './CmsComponentHandler';

import Intro from '../App/Intro';
import Header from '../App/_Header';
import Footer from '../App/_Footer';
import Histroy from '../App/History';
import ExperienceOverview from '../App/ExperienceOverview';
import NavigationRegistry from './Router/NavigationRegistry';
import Outro from '../App/Outro';

export default class Bootstrap extends React.Component {
   
    appElement : HTMLElement;

    disabledAnchorTagsSelector = 'a:not(.reload)'

    data : any

    get componentHandler() {
        return CmsComponentHandler.getInstance();
    }

    constructor(app : HTMLElement) {
        super({});

        this.appElement = app;
        this.componentHandler.appElement = this.appElement;
    }

	init(navigations : NavProps[] = []): any {
        this.componentHandler.init();
        
        NavigationRegistry.init(navigations);

        fetch('/data/career.json').then((response) => {
            if (response.ok) {
                return response.json().then((data) => {
                    this.data = data;
                    ReactDOM.render(this.render(), this.appElement, () => {
                        NavigationRegistry.updateNavigations().then(() => {
                            this.componentHandler.startRouter();
                        })
                    });

                })
            }
        });
    }
    
    render() {
        return (
			<div>
				<Header data={this.data.header} />
				<main>
					<ExperienceOverview data={this.data.history} />
					<Intro data={this.data.intro} />
					<Histroy data={this.data.history} />
					<Outro data={this.data.outro} />
				</main>
				<Footer data={this.data.footer} />	
			</div>
        )
    }

} 