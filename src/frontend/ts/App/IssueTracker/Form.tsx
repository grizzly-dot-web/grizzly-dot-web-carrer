import * as React from 'react';
import Content from '../../Core/Components/Content';
import { GitHubIssueBody } from '../../../../backend/Components/IssueTracker/_shared/Models/GitHubIssueBody';
import { ContributerResponse, LabelResponse } from '../../../../backend/Components/IssueTracker/_shared/Models/GitHubResponses';
import { Label } from './Label';
import { Contributer } from './Contributer';

export interface FormProps {

    onSubmit: (event : React.FormEvent<HTMLFormElement|HTMLButtonElement>, form : GitHubIssueBody) => void

    form : GitHubIssueBody

    classes: string[]

    labels: LabelResponse[]

    contribs: ContributerResponse[]

}

export interface FormState {

    form : GitHubIssueBody
}

export class Form extends React.Component<FormProps, FormState> {

    constructor(props : FormProps) {
        super(props);
        
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleChange = this.handleChange.bind(this)

        this.state = {
            form: {
                title: '',
                body: '',
                assignees: [],
                labels: [],
                milestone: 0
            }
        }
    }

    render() {
        let labels = this.renderCheckboxList('Label: ', 'labels', this.props.labels.map( e => {
            return {
                id : e.id.toString(),
                name: e.name,
                label: (<Label {...e} />)
            }
        }));

        let collaborators = this.renderCheckboxList('Zuweisen: ', 'assignees', this.props.contribs.map( e => {
            return {
                id : e.id.toString(),
                name: e.login,
                label: (<Contributer {...e} />)
            }
        }));

        return (
            <form onSubmit={this.handleSubmit} className={`Form IssueTracker_From ${this.props.classes.join(' ')}`}>
                <fieldset className="Form_Fieldset">
                    <legend className={`Form_Fieldset_Legend`}>Erstellen Sie hier das entsprechende Ticket.</legend>
                    <input className="Form_TextInput IssueTracker_Form_TextInput-Title" placeholder={`Titel des Tickets`} type="text" name="title" value={this.state.form.title} onChange={(e) => this.handleChange(e)}  />
                    {labels}
                    <div>
                        <label className={'Form_MarkdownEditor'}>
                            <span className={`Form_Label_Inner`}>Beschreibung:</span>
                            <textarea placeholder={`Geben Sie hier eine Beschreibung der Angelegenheit an.`} className={'Form_Textarea'} name="body" value={this.state.form.body} onChange={(e) => this.handleChange(e)} />
                            <Content classes={['Form_Markdown_Preview']}  allowedHeadlineLevel={3} forceBlock={true} data={this.state.form.body} />
                        </label>
                    </div>
                    {collaborators}
                </fieldset>
                <button onClick={this.handleSubmit} className={`Form_Button`} type="submit">Absenden</button>
            </form>
        );
    }

    handleSubmit(event : React.FormEvent<HTMLFormElement|HTMLButtonElement>) {
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

        this.props.onSubmit(event, form);

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
    

    renderCheckboxList(label : string, key : string, checkboxItems : {id : string, name:string, label: React.ReactElement<any>}[]): any {
        let rendered = [];
        for (let item of checkboxItems) {
            let from : any = this.state.form;

            if (checkboxItems.length == 1) {
                from[key].push(item.id);
            }
            
            let checked = from[key].indexOf(item.id) !== -1 ? true : false;

            rendered.push(
                <label key={item.name} className={`From_CheckboxList_Item`}>
                    <input name={name} value={item.id} checked={checked} type="checkbox" onChange={(e) => this.handleChange(e, true)}/> {item.label}
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
}
