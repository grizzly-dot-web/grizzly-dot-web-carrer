import React from "react";

export interface CheckboxList_Item {
    value : string
    name:string
    label: React.ReactElement<any>
}

export interface CheckboxListProps {
    label : string 
    name : string
    value: string|string[]
    checkboxItems : CheckboxList_Item[] 
    multiChoice : boolean
    onChange : (e : React.ChangeEvent<HTMLInputElement>, key : string, multiChoice : boolean) => void
}

export default class CheckboxList extends React.Component<CheckboxListProps> {
    render() {
        let rendered = [];
        for (let item of this.props.checkboxItems) {
            let checked = this.props.value.indexOf(item.value) !== -1 ? true : false;

            rendered.push(
                <label key={item.name} className={`From_CheckboxList_Item`}>
                    <input className="Form_Element" name={item.name} value={item.value} checked={checked} type="checkbox" onChange={(e) => this.props.onChange(e, this.props.name, this.props.multiChoice)}/> {item.label}
                </label>
            );
        }

        if (rendered.length <= 0) {
            return null;
        }

        return (
            <div className={`Form_Element From_CheckboxList`}>
                <span className={`Form_Label_Inner`}>{this.props.label}</span>
                {rendered}
            </div>
        );
    }
}