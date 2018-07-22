import * as React from 'react';
import { CmsProps, CmsState } from '../../Core/CmsControlledComponent';
import Content from '../../Core/Components/Content';
import CmsRoutingComponent from '../../Core/Router/AbstractRoutingComponent';
import { GitHubIssueBody } from '../../../../backend/Components/IssueTracker/_shared/Models/GitHubIssueBody';
import { IssueResponse, ContributerResponse, LabelResponse } from '../../../../backend/Components/IssueTracker/_shared/Models/GitHubResponses';
import { IssueTrackerRepoInfo } from '../../../../backend/Components/IssueTracker/IssueTracker';
import {Label} from './Label';
import { Issue } from './Issue';
import { Form } from './Form';

export interface GitHubProps extends CmsProps<undefined> {
    
}

export interface GitHubState extends CmsState {
    formClasses: string[],
    issues : IssueResponse[]
    contribs : ContributerResponse[]
    labels : LabelResponse[]
    form : GitHubIssueBody
}

export default class IssueTracker extends CmsRoutingComponent<GitHubProps, GitHubState> {
    
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
                assignees: [],
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
                    {this.renderForm()}
                    <button className="IssueTracker_CloseButton" onClick={this.leave.bind(this)}>Schließen</button>
                </div>
            </section>
        );
    }

    renderForm() {
        return <Form classes={this.state.formClasses} form={this.state.form} onSubmit={this.handleFormSubmit} labels={this.state.labels} contribs={this.state.contribs}></Form>
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

                console.log(this.state)
                this.setState({
                    ...this.state,
                    ...json
                }, () => {
                    console.log(this.state)
                });
            })
            .catch(err => console.error(err));
    }

    handleFormSubmit(event : React.FormEvent<HTMLFormElement|HTMLButtonElement>, form : GitHubIssueBody) {
        this.fetch('/issue_tracker/issues/create', {
                method: "POST",
                body: JSON.stringify(form),
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
        console.log('success', issue.url)
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
		this.appElement.classList.remove('history__is-active');
		this.appElement.classList.add('header__right-dark');
    }
    
    leave(): void {
        if (!this.ref) {
            return;
        }

        this.ref.classList.remove('IssueTracker_isActive');
        this.appElement.classList.remove('header__bg-active');
    }
}