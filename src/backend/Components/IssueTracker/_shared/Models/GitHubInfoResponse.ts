

export interface GitHubLabelEdges {
    "node": {
        "id": string,
        "name": string,
        "description": string
    }
}
export interface GitHubReactionsEdges {
    "node": {
        "id": string,
        "content": "THUMBS_UP|THUMBS_DOWN|LAUGH|HOORAY|CONFUSED|HEART"
    }
}
export interface GitHubCollaboratorsEdges {
    "node": {
        "id": string,
        "name": string
    }
}
export interface GitHubIssueEdges {
    "node": {
        "reactions": {
            "edges": GitHubReactionsEdges[]
        },
        "id": string,
        "title": string,
        "url": string
    }
}
export default interface GitHubInfoResponse {
    "data": {
        "repository": { 
            "issues": { 
                "edges": any[] 
                "totalCount": number,
            },
            "collaborators": {
              "edges": GitHubCollaboratorsEdges[]
            },
            "labels": {
              "totalCount": number,
              "edges": GitHubLabelEdges[]
            }
          }
    }
    "error"? : {message:string}[]
}





