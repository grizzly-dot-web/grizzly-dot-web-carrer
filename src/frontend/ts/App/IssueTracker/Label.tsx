import * as React from 'react';
import { LabelResponse } from "../../../../backend/Components/IssueTracker/_shared/Models/GitHubResponses";

export interface LabelProps extends LabelResponse {
    className?: string
}

export class Label extends React.Component<LabelProps> {
    render() {
        return (
            <div className={`IssueTracker_Label ${this.props.className || ''}`} style={{backgroundColor: `#${this.props.color}`}}>
                <span className={'IssueTracker_Label_Name'} title={this.props.description}>{this.props.name}</span>
            </div>
        );
    }
}
