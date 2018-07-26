import * as React from 'react';
import browser from 'browser-detect';

import AtomicComponent, { AtomicState, AtomicProps } from '../../../../atomicCCMS/_shared/Components/Abstract/AtomicComponent/client';

import DebugIssueResponse, { IssueResponse, ContributerResponse, LabelResponse } from './_shared/Models/GitHubResponses';
import { GitHubIssueBody } from './_shared/Models/GitHubIssueBody';

import { Issue } from './client/Issue';
import { Form } from './client/Form';
import { IssueTrackerRepoInfo } from './_shared/Models/GithubRepoInfo';

export interface GitHubProps extends AtomicProps {
    
}

export interface GitHubState extends AtomicState {
    createdIssue?: IssueResponse
    lastCreatedIssue?: IssueResponse
    formClasses: string[],
    issues : IssueResponse[]
    contribs : ContributerResponse[]
    labels : LabelResponse[]
    form : GitHubIssueBody
}

export default class IssueTracker extends AtomicComponent<GitHubProps, GitHubState> {
    
    navigationId() { return '' };

    link() { 
        return {
            url: '/feedback',
            title: '',
            text: 'Feedback',
        }
    }

    ref: HTMLElement | null;

    constructor(props : any) {
        super(props);
        
        this.state = {
            issues: [],
            labels: [],
            contribs: [],
            form: {
                title: '',
                body: '',
                labels: [],
                assignee: '',
                milestone: 0, 
            },
            formClasses: []
        };

        this.ref = null;
        this.handleFormSubmit = this.handleFormSubmit.bind(this);  
    }


    render() {

        return (
            <section ref={ref => this.ref = ref} className={`IssueTracker`}>
                <div className={`IssueTracker_Inner`}>
                    <h2 className={`h1`}>Hinterlassen Sie gerne Ihr Feedback.</h2>
                    {this.renderIssues()}
                    <Form classes={this.state.formClasses} form={this.state.form} onSubmit={this.handleFormSubmit} labels={this.state.labels} contribs={this.state.contribs}></Form>
                    <a className="IssueTracker_CloseButton" href="/">Schließen</a>
                </div>
                {this.renderResponseMessage()}
            </section>
        );
    }

    renderResponseMessage() {
        if (!this.ref) {
            return;
        }
        let ref = this.ref as HTMLElement;
        let message = null;

        
        let handleCloseResponseMessage = (e : Event) => {
            ref.classList.remove('IssueTracker_ResponseMessage-isActive'); 
            ref.classList.add('IssueTracker_ResponseMessage-isInactive'); 

            this.setState(Object.assign(this.state, {
                ...this.state,
                createdIssue: undefined,
                lastCreatedIssue: this.state.createdIssue,
            }));
            console.log( handleCloseResponseMessage);

            document.removeEventListener('click', handleCloseResponseMessage);
        }

        let statusClass = '';
        if (this.state.createdIssue != undefined) {
            this.ref.classList.add('IssueTracker_ResponseMessage-isActive');
            this.ref.classList.remove('IssueTracker_ResponseMessage-isInactive');
            document.addEventListener('click', handleCloseResponseMessage);

            if (this.state.createdIssue.html_url) {
                statusClass = 'IssueTracker_ResponseMessage-Successful';
                message = (
                    <p>
                        Danke für Ihr Feedback<br />
                        Hier ist der <a target="_blank" href={this.state.createdIssue.html_url}>Link zum Ticket</a>
                    </p>
                );
            } else {
                statusClass = 'IssueTracker_ResponseMessage-Unsuccessful';
                message = (
                    <p>
                        Leider is etwas schief gegangen.<br />
                        Es wäre nett wenn Sie mir per Email bescheid. <a target="_blank" href="mailto:info@sebgrizzly.com">info@sebgrizzly.com</a> 
                    </p>
                )
            }
        } 

        return (
            <div className={`IssueTracker_ResponseMessage ${statusClass}`}>
                {message}
            </div>
        )
    }

    componentDidMount() {
        this.updateStateByFetch();
    }

    updateStateByFetch() {
        this.fetch('/issue_tracker/info')
            .then((response) => response.json())
            .then((json : IssueTrackerRepoInfo) => {
                if (!json.contribs) {
                    return;
                }

                this.setState({
                    ...this.state,
                    ...json
                });
            })
            .catch(err => console.error(err));
    }

    handleFormSubmit(event : React.FormEvent<HTMLFormElement|HTMLButtonElement>, form : GitHubIssueBody) {
        if (this.state.lastCreatedIssue && this.state.lastCreatedIssue.title === form.title) {
            return;
        }

        let submitForm = {
            ...form,
            body: `
# Description

${form.body}

## Browserinformation
| Info |  |
| :-- | :-- |
| Browser | ${browser().name} |
| OS | ${browser().os} |
| Version | ${browser().version} - ${browser().versionNumber} | 
            `
        }; 

        if (form.title.indexOf('DEBUGONLY') !== -1) {
            this.handleCreatedIssue(DebugIssueResponse);
            return event.preventDefault();
        }

        this.setState({
            ...this.state,
            form: {
                title: '',
                body: '',
                labels: [],
                assignee: '',
                milestone: 0,
            }
        });

        this.fetch('/issue_tracker/issues/create', {
                method: "POST",
                body: JSON.stringify(submitForm),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            .then((response) => response.json())
            .then((json : IssueResponse) => {
                this.handleCreatedIssue(json);
            })
        ;

        return event.preventDefault();
    }

    handleCreatedIssue(issue : IssueResponse) {
        if (!issue.html_url) {
            return;
        }
        let ref = this.ref as HTMLElement;

        let issues = this.state.issues; 
        this.setState(Object.assign(this.state, {
            ...this.state,
            createdIssue: issue,
            issues: issues
        }));
    }

    renderIssues() {
        if (this.state.issues.length <= 0) {
            return null;
        }

        let rendered = [];
        for (let issue of this.state.issues) {
            rendered.push(<Issue key={issue.id} {...issue}/>)
        }
        

        return (
            <div className="IssueTracker_Issues">
                <p>Hier sind andere Tickets, die bereits erstellt worden sind, es wäre nett einmal einen Abgleich zumachen, um zu vermeiden Duplikate zu erstellen.</p>
                <div className="IssueTracker_Issues_Inner">
                    {rendered}
                </div>
            </div>
        )
    }

    enter(): void {
        if (!this.ref) {
            return;
        }

        let clickOutsideHandler = (e : Event) => {
            this.leave.bind(this);
            document.removeEventListener('click', clickOutsideHandler);
        };

        document.addEventListener("click", (evt) => {  
            if (!this.ref) {
                return;
            }
            const flyoutElement = this.ref.querySelector('.IssueTracker_Inner') as HTMLElement;
            let targetElement = evt.target as Node|null; 
        
            do {
                if (targetElement == flyoutElement) {
                    // This is a click inside. Do nothing, just return.
                  
                    return;
                }
                // Go up the DOM
                targetElement = targetElement ? targetElement.parentNode : null;
            } while (targetElement);
        
            // This is a click outside.
     //       this.leave();
        });

        this.ref.classList.add('IssueTracker_isActive');
    }
    
    leave(): void {
        if (!this.ref) {
            return;
        }

        this.ref.classList.remove('IssueTracker_isActive');
    }
}