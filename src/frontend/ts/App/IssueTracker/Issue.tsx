import * as React from 'react';
import { LabelResponse, IssueResponse } from "../../../../backend/Components/IssueTracker/_shared/Models/GitHubResponses";
import { Label } from './Label';


export class Issue extends React.Component<IssueResponse> {
    render() {
        let renderedLabels = [];
        for (let label of this.props.labels) {
            renderedLabels.push(<Label key={label.id} {...label} />)
        }

        return (
            <a target="_blank" className="IssueTracker_IssueLink" href={this.props.html_url}>
                {this.props.title}
                <span className={'IssueTracker_IssueLink_Labels'}>
                    {renderedLabels}
                </span>
            </a>
        );
    }
}
