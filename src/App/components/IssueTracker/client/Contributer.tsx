import * as React from 'react';
import { ContributerResponse } from '../_shared/Models/GitHubResponses';

export interface ContributerProps extends ContributerResponse {
    className?: string
}

export class Contributer extends React.Component<ContributerProps> {
    render() {
        return (
            <div className={`IssueTracker_Contributer ${this.props.className || ''}`} >
                <span>{this.props.login}</span>
            </div>
        );
    }
}
