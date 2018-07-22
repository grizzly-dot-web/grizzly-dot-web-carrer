import * as React from 'react';
import { ContributerResponse } from "../../../../backend/Components/IssueTracker/_shared/Models/GitHubResponses";

export class Contributer extends React.Component<ContributerResponse> {
    render() {
        return (
            <div className={`IssueTracker_Contributer`} >
                <span>{this.props.login}</span>
            </div>
        );
    }
}
