export interface GitHubIssueBody {
    title: string,
    body: string,
    milestone?: number,
    assignee: string,
    labels: string[]
}