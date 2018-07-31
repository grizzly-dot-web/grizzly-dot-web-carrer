import 'whatwg-fetch';

import React from "react";

import Header from './_partials/Header';
import Footer, { SocialLink } from './_partials/Footer';

import IssueTracker from './Components/IssueTracker/_index';
import ExperienceOverview, { HistoryEntry } from './Components/ExperienceOverview/_index';

export interface AppState {
    isssueTrackerIsActive : boolean
    history: HistoryEntry[] 
    socialLinks: SocialLink[]
}

export default class App extends React.Component<any, AppState> {

    constructor(props : any, context : any) {
        super(props, context);
        
        this.state = {
            isssueTrackerIsActive: false,
            history: [],
            socialLinks: [],
        }

        this.handleFeedbackClick = this.handleFeedbackClick.bind(this);
    }

    render() {
        return (
            <div className="App">
                <Header />
                <div className="App_Main">
                    <div className="Textarea">
                        <h2>Welcome to this website,</h2>
                        <p>here you have the possibillity to get an exact overview over my skillset.</p>
                        <p>For example here are some predifined Filters to check them out.</p>
                    </div>
                    <ExperienceOverview data={this.state.history} />
                    <IssueTracker isActive={this.state.isssueTrackerIsActive} onClose={this.handleFeedbackClick}/>
                </div>
                <Footer socialLinks={this.state.socialLinks} onFeedbackClick={this.handleFeedbackClick}/>
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

    handleFeedbackClick(e : React.MouseEvent<HTMLButtonElement>) {
        this.setState({
            ...this.state,
            isssueTrackerIsActive: !this.state.isssueTrackerIsActive
        });

        e.preventDefault();
    }

    fetchData() {
        return fetch('/content/data.json').then((response) => {
            return response.json().then((data) => {
                return data;
            })
        });
    }

}