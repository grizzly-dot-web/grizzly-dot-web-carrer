import { IssueResponse, LabelResponse, ContributerResponse } from "./GitHubResponses";

export interface IssueTrackerRepoInfo {
    issues: IssueResponse[]
    labels: LabelResponse[]
    contribs: ContributerResponse[]
}