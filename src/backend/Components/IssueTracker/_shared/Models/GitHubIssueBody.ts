export interface GitHubIssueBody {
    title: string,
    body: string,
    assignees: string[],
    milestone: number,
    labels: string[]
}