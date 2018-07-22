export interface LabelResponse {
    id : number
    node_id : string,
    url: string,
    name: string,
    description: string,
    color: string,
    default: boolean
}

export interface ContributerResponse {
    login: string,
    id: number,
    node_id: string,
    avatar_url: string,
    gravatar_id: string,
    url: string,
    html_url: string,
    followers_url: string,
    following_url: string,
    gists_url: string,
    starred_url: string,
    subscriptions_url: string,
    organizations_url: string,
    repos_url: string,
    events_url: string,
    received_events_url: string,
    type: string,
    site_admin: boolean,
    permissions?: {
        pull: boolean,
        push: boolean,
        admin: boolean
    }
}

export interface MilestoneResponse {
    url: string,
    html_url: string,
    labels_url: string,
    id: number,
    node_id: string,
    number: number,
    state: string,
    title: string,
    description: string,
    creator: ContributerResponse,
    open_issues: number,
    closed_issues: number,
    created_at: string,
    updated_at: string,
    closed_at: string,
    due_on: string
}

export interface IssueResponse {
    id: number,
    node_id: string,
    url: string,
    repository_url: string,
    labels_url: string,
    comments_url: string,
    events_url: string,
    html_url: string,
    number: number,
    state: string,
    title: string,
    body: string,
    user: ContributerResponse,
    labels: LabelResponse[],
    assignee: ContributerResponse,
    assignees: ContributerResponse[],
    milestone: MilestoneResponse,
    locked: true,
    active_lock_reason: string,
    comments: number,
    pull_request: {
      url: string,
      html_url: string,
      diff_url: string,
      patch_url: string
    },
    closed_at: null,
    created_at: string,
    updated_at: string
  }






























// GraphQL Response

interface GitHubLabelEdges {
    node: {
        id: string,
        name: string,
        description: string
    }
}
interface GitHubReactionsEdges {
    node: {
        id: string,
        content: string
    }
}
interface GitHubCollaboratorsEdges {
    node: {
        id: string,
        name: string
    }
}
interface GitHubIssueEdges {
    node: {
        reactions: {
            edges: GitHubReactionsEdges[]
        },
        id: string,
        title: string,
        url: string
    }
}
interface GitHubInfoResponse {
    data: {
        repository: { 
            issues: { 
                edges: any[] 
                totalCount: number,
            },
            collaborators: {
              edges: GitHubCollaboratorsEdges[]
            },
            labels: {
              totalCount: number,
              edges: GitHubLabelEdges[]
            }
          }
    }
    error? : {message:string}[]
}





