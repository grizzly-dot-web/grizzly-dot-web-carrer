import Markdown from 'markdown-to-jsx';
import * as React from 'react';

import { Label } from './Label';
import { Contributer } from './Contributer';
import { GitHubIssueBody } from '../../../../../backend/Components/IssueTracker/_shared/Models/GitHubIssueBody';
import { LabelResponse, ContributerResponse } from '../../../../../backend/Components/IssueTracker/_shared/Models/GitHubResponses';
import CheckboxList from '../CheckboxList';

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

    ref : HTMLFormElement|null = null

    constructor(props : FormProps) {
        super(props);
        
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleChange = this.handleChange.bind(this)

        this.state = {
            form: {
                title: '',
                body: '',
                assignee: '',
                labels: [],
                milestone: 0
            }
        }
    }

    render() {
        let labels = this.renderCheckboxList('Label: ', 'labels', this.props.labels.map( e => {
            return {
                value : e.name,
                name: e.name,
                label: (<Label className={'From_CheckboxList_Item_Label'} {...e} />)
            }
        }));

        let collaborators = this.renderCheckboxList('Assignee: ', 'assignee', this.props.contribs.map( e => {
            return {
                value : e.login,
                name: e.login,
                label: (<Contributer className={'From_CheckboxList_Item_Label'} {...e} />)
            }
        }), false);

        return (
            <form ref={ref => this.ref = ref} onSubmit={this.handleSubmit} className={`Form IssueTracker_From ${this.props.classes.join(' ')}`}>
                <fieldset className="Form_Fieldset">
                    <legend className={`Form_Fieldset_Legend`}>Create a new Issue.</legend>
                    <div className="LayoutContainer">
                        <div className="LayoutContainer IssueTracker_From_ElementWrap">
                            <input required={true} className="Form_Element Form_TextInput IssueTracker_Form_TextInput-Title" placeholder={`Issue Title`} type="text" name="title" value={this.state.form.title} onChange={(e) => this.handleChange(e)}  />
                            <div className={`LayoutContainer_ElementWrapper LayoutContainer_ElementWrapper-Half`}>
                                <label className={'Form_Element Form_MarkdownEditor'}>
                                    <span className={`Form_Label_Inner`}>Description:</span>
                                    <textarea required={true} placeholder={`Leave an description for the Issue.`} className={'Form_Element Form_Textarea'} name="body" value={this.state.form.body} onChange={(e) => this.handleChange(e)} />
                                    <Markdown className={'Form_Markdown_Preview'}  options={ { forceBlock: true } }>{this.state.form.body}</Markdown>
                                </label>
                            </div>
                            <div className={`LayoutContainer_ElementWrapper LayoutContainer_ElementWrapper-Half`}>
                                {labels}
                                {collaborators}
                            </div>
                        </div>
                    </div>
                </fieldset>
                <button onClick={this.handleSubmit} className={`Form_Element Form_Button`} type="submit">Submit</button>
            </form>
        );
    }
    
    renderCheckboxList(label : string, key : string, checkboxItems : {value : string, name:string, label: React.ReactElement<any>}[], multiChoice : boolean = true): any {
        let form : any = this.state.form;
        let value = form[key];
        
        if (checkboxItems.length == 1) {
            if (multiChoice) {
                value.push(checkboxItems[0].value);
            } else {
                value = checkboxItems[0].value;
            }
        }

        return <CheckboxList label={label} name={key} key={key} value={value} checkboxItems={checkboxItems} multiChoice={multiChoice} onChange={this.handleChange}/>
    }

    handleSubmit(event : React.FormEvent<HTMLFormElement|HTMLButtonElement>) {
        let ref = this.ref as HTMLFormElement;

        let formClasses = [];
        let form = this.state.form;

        for (let input of ref.querySelectorAll('select, input, textarea') as NodeListOf<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) {
            this.handleElementErrors(input);
        }

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
        ref.reset()

        return event.preventDefault();

    }

    handleElementErrors(element : HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement) {
        element.classList.remove('Form_Element-invalid')
        
        if (element.getAttribute('required') === null) {
            return;
        }

        if (element.value && element.value.trim() != '' || element.innerText != '') {
            return;
        }

        element.classList.add('Form_Element-invalid')
    }

    handleChange(event : React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>, formKey? : string, multiChoice = true) {
        let form = this.state.form as any;
        let stateFormKey = formKey || event.target.name;

        if (form[stateFormKey] === undefined) {
            throw new Error(`Form property did not exists: ${event.target.name}`)
        }

        this.handleElementErrors(event.target);

        // handle value as array
        let value : string[]|string= form[stateFormKey];
        if (multiChoice && formKey && typeof value != "string") {
            let index = value.indexOf(event.target.value);
            if (index !== -1) {
                value.splice(index, 1)
            } else {
                value.push(event.target.value);
            }
        } else {
            value = event.target.value
        }

        let formUpdate = {
            ...this.state.form,
            [stateFormKey]: value
        }

        this.setState({
            ...this.state,
            form: formUpdate
        });
    }
}
