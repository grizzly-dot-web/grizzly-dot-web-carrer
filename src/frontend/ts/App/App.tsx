import 'whatwg-fetch';

import React from "react";

import Header from './_partials/Header';
import Footer, { SocialLink } from './_partials/Footer';

import IssueTracker from './Components/IssueTracker/_index';
import ExperienceOverview, { HistoryEntry } from './Components/ExperienceOverview/_index';

export interface AppState {
    history: HistoryEntry[] 
    socialLinks: SocialLink[]
}

export default class App extends React.Component<any, AppState> {

    constructor(props : any, context : any) {
        super(props, context);
        
        this.state = {
            history: [],
            socialLinks: [],
        }
    }

    render() {
        console.log(this.state);

        return (
            <div className="App">
                <Header />
                <div className="App_Main">
                    <ExperienceOverview data={this.state.history} />
                    <IssueTracker />
                </div>
                <Footer socialLinks={this.state.socialLinks} />
            </div>
        )
    }

    componentDidMount() {
        this.fetchData().then((data) => {
            this.setState(
                Object.assign(this.state, data)
            );
        });
    }

    fetchData() {
        return fetch('/content/data.json').then((response) => {
            return response.json().then((data) => {
                return data;
            })
        });
    }

}