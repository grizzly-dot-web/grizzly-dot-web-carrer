import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { NavProps } from './Router/Navigation';

import CmsComponentHandler from './CmsComponentHandler';

import Header from '../App/_partials/Header';
import Footer from '../App/_partials/Footer';
import Histroy from '../App/History';
import ExperienceOverview from '../App/ExperienceOverview';
import NavigationRegistry from './Router/NavigationRegistry';
import Introduction from '../App/Introduction';
import Start from '../App/Start';
import InfoCenter from '../App/_partials/InfoCenter';
import IssueTracker from '../App/IssueTracker/index';

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

        fetch('/compiled/data.json').then((response) => {
            if (response.ok) {
                return response.json().then((data) => {
                    this.data = data;
                    
                    ReactDOM.render(this.render(), this.appElement, () => {
                        NavigationRegistry.updateNavigations().then(() => {
                            this.componentHandler.startRouter();
                        });
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
                    <Start data={this.data.start} />
					<Introduction data={this.data.introduction} />
					<Histroy data={this.data.history} />
				</main>
				<InfoCenter data={this.data.infoCenter} />	
				<IssueTracker data={this.data.gitHub} />	
				<Footer data={this.data.footer} />	
			</div>
        )
    }

} 