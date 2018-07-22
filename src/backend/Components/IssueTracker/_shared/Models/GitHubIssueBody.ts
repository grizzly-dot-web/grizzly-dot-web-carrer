export interface GitHubIssueBody {
    title: string,
    body: string,
    milestone?: number,
    assignees: string[],
    labels: string[]
}