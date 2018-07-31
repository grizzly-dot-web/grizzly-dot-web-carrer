import 'whatwg-fetch';

import React from "react";

import Header from './_partials/Header';
import Footer, { SocialLink } from './_partials/Footer';

import IssueTracker from './Components/IssueTracker/_index';
import ExperienceOverview, { HistoryEntry } from './Components/ExperienceOverview/_index';
import { FilterEntries } from './Components/ExperienceOverview/Filter';

export interface AppState {
    filter : FilterEntries
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
            filter: {
                tags: ['interested'],
                level: 200
            },
        }

        this.handleFilterChange = this.handleFilterChange.bind(this);
        this.handleFeedbackClick = this.handleFeedbackClick.bind(this);
    }

    render() {
        return (
            <div className="App">
                <Header />
                    <div className="App_Main">
                        <div className="Textarea">
                            <div className="Textarea_Block">
                                <h2>Welcome to this website,</h2>
                                <p>
                                    here you have the possibillity to get an exact overview of my skillset.<br />
                                    For example here are some predefined filters to check them out.
                                </p>
                                <div className="LayoutContainer">
                                    <div className="LayoutContainer_ElementWrapper LayoutContainer_ElementWrapper-Half">
                                        <p>
                                            To watch my learned skills and those im interested in <button className="button" onClick={() => this.handleFilterChange(300, ['interested'])}>click here!</button>
                                        </p>
                                    </div>
                                    <div className="LayoutContainer_ElementWrapper LayoutContainer_ElementWrapper-Half">
                                        <p>
                                            Show only the skills, i have masterd and work with them on a daily basis <button className="button" onClick={() => this.handleFilterChange(500, [])}>click here!</button>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    <ExperienceOverview data={this.state.history} filter={this.state.filter} />
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

    handleFilterChange(level : number, tags : string[]) {
        this.setState({
            ...this.state,
            filter: {
                tags: tags,
                level: level
            }
        }, () => {
            console.log(this.state)
            
            this.forceUpdate();
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