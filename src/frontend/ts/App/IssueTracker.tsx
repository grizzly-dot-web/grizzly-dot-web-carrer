import * as React from 'react';
import { CmsProps, CmsState } from '../Core/CmsControlledComponent';
import Content from '../Core/Components/Content';
import CmsRoutingComponent from '../Core/Router/AbstractRoutingComponent';
import { GitHubIssueBody } from '../../../backend/Components/IssueTracker/_shared/Models/GitHubIssueBody';
import GitHubInfoResponse from '../../../backend/Components/IssueTracker/_shared/Models/GitHubInfoResponse';
import Markdown from 'markdown-to-jsx';
import { resolve } from 'dns';

export interface GitHubProps extends CmsProps<undefined> {
}
export interface GitHubState extends CmsState {
    formClasses: string[],
    info : GitHubInfoResponse
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
            info: {
                data: {
                    repository: {
                        issues: {
                            edges: [],
                            totalCount: 0
                        },
                        labels: {
                            edges: [],
                            totalCount: 0
                        },
                        collaborators: {
                            edges: []
                        },
                    }
                }
            },
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
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleChange = this.handleChange.bind(this)
    }

    render() {
        let labels = this.renderCheckboxList('Label: ', 'labels', this.state.form.labels, this.state.info.data.repository.labels.edges.map((e) => e.node));
        let collaborators = this.renderCheckboxList('Zuweisen: ', 'assignees', this.state.form.assignees, this.state.info.data.repository.collaborators.edges.map((e) => e.node));

        return (
            <section ref={ref => this.ref = ref} className={`IssueTracker`}>
                <div className={`IssueTracker_Inner`}>
                    <h2 className={`h1`}>Hinterlassen Sie gerne Ihr Feedback.</h2>
                    {this.renderIssues()}
                    <form onSubmit={this.handleSubmit} className={`Form IssueTracker_From ${this.state.formClasses.join(' ')}`}>
                        <fieldset className="Form_Fieldset">
                            <legend className={`Form_Fieldset_Legend`}>Erstellen Sie hier das entsprechende Ticket.</legend>
                            <input className="Form_TextInput IssueTracker_Form_TextInput-Title" placeholder={`Titel des Tickets`} type="text" name="title" value={this.state.form.title} onChange={(e) => this.handleChange(e)}  />
                            <div>
                                <label className={'Form_MarkdownEditor'}>
                                    <span className={`Form_Label_Inner`}>Beschreibung:</span>
                                    <textarea placeholder={`Geben Sie hier eine Beschreibung der Angelegenheit an.`} className={'Form_Textarea'} name="body" value={this.state.form.body} onChange={(e) => this.handleChange(e)} />
                                    <Content classes={['Form_Markdown_Preview']}  allowedHeadlineLevel={3} forceBlock={true} data={this.state.form.body} />
                                </label>
                            </div>
                            {labels}
                            {collaborators}
                        </fieldset>
                        <button onClick={this.handleSubmit} className={`Form_Button`} type="submit">Absenden</button>
                    </form>
                </div>
            </section>
        );
    }

    componentDidMount() {
        this.fetch('/issue_tracker/info')
            .then((response) => response.json())
            .then((json) => {
                let info = {
                    ...this.state.info,
                    ...json
                };

                this.setState({
                    ...this.state,
                    info
                });
            })
            .catch(err => console.error(err));
    }

    componentDidUpdate() {
        console.log(this.state.form.body)
    }

    handleSubmit(event : React.FormEvent<HTMLFormElement|HTMLButtonElement>) {
        event.preventDefault();

        let formClasses = [];
        let form = this.state.form;
        if (!form.title) {
            formClasses.push('IssueTracker_Form_Title-invalid');
        }
        if (!form.body) {
            formClasses.push('IssueTracker_Form_Body-invalid');
        }

        if (formClasses.length > 0) {
            formClasses.push(`IssueTracker_Form-invalid`);
            return event.preventDefault();
        }

        this.fetch('/issue_tracker/create', {
                method: "POST",
                body: JSON.stringify(form),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            .then((response) => response.json())
            .then((json) => console.log(json))
        ;

        return event.preventDefault();
    }

    handleChange(event : React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>, isArray = false) {
        let form = this.state.form as any;
        if (form[event.target.name] === undefined) {
            throw new Error(`Form property did not exists: ${event.target.name}`)
        }

        let formUpdate = {
            ...this.state.form,
            [event.target.name]: (isArray) ? form[event.target.name].push(event.target.value) : event.target.value
        }

        this.setState({
            ...this.state,
            form: formUpdate
        });
    }

    renderSelect(label : string, key : string, value : string, options : {value:string, text:string}[]) {
        let rendered = [];
        for (let item of options) {
            rendered.push(
                <option selected={value === item.value} value={item.value}>{item.text}</option>
            );
        }

        if (rendered.length <= 0) {
            return null;
        }

        return (
            <select value={value} name={key} onChange={(e) => this.handleChange(e)}>
                {rendered}
            </select>
        );
    }

    renderCheckboxList(label : string, key : string, value : string[], checkboxItems : {id:string, name:string, description?:string}[]): any {
        let rendered = [];
        for (let item of checkboxItems) {
            let checked = value.indexOf(item.id) !== -1 ? true : false
            rendered.push(
                <label className={`From_CheckboxList_Item`}>
                    <input key={item.id} name={key} value={item.id} checked={checked} type="checkbox" onChange={(e) => this.handleChange(e, true)}/> {item.name} {item.description||''}
                </label>
            );
        }

        if (rendered.length <= 0) {
            return null;
        }

        return (
            <label className={`From_CheckboxList`}>
                <span className={`Form_Label_Inner`}>{label}</span>
                {rendered}
            </label>
        );
    }

    renderIssues() {
        return (
            <p>Hier sind andere Tickets, die bereits erstellt worden sind, es wäre nett einmal einen Abgleich zumachen, um zu vermeiden Duplikate zu erstellen.</p>
        )
    }

    enter(): void {
        this.appElement.classList.add('header__bg-active');
		this.appElement.classList.remove('history__is-active');
		this.appElement.classList.remove('header__right-dark');
    }
    leave(): void {
        this.appElement.classList.remove('header__bg-active');
    }
}