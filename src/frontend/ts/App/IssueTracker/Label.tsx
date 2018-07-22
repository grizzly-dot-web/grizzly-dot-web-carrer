import * as React from 'react';
import { LabelResponse } from "../../../../backend/Components/IssueTracker/_shared/Models/GitHubResponses";


export class Label extends React.Component<LabelResponse> {
    render() {
        return (
            <div className={`IssueTracker_Label`} style={{backgroundColor: this.props.color}}>
                <span>{this.props.name}</span>
            </div>
        );
    }
}
