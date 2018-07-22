import nodeFetch from "node-fetch";
import config from "config-yml";
import { GitHubIssueBody } from "./_shared/Models/GitHubIssueBody";
import { LabelResponse, IssueResponse, ContributerResponse } from "./_shared/Models/GitHubResponses";

export default class GithubService {

    fetchIssues() : Promise<IssueResponse[]> {
        return this._defaultApiFetch(`issues?state=open&sort=updated`, 'application/vnd.github.symmetra-preview+json')
    }

    fetchContributers() : Promise<ContributerResponse[]> {
        return this._defaultApiFetch(`contributors`, 'application/vnd.github.symmetra-preview+json')
    }

    fetchLabels() {
        return this._defaultApiFetch(`labels`, 'application/vnd.github.symmetra-preview+json')
    }

    createIssue(data : GitHubIssueBody) : Promise<IssueResponse> {
        delete data.milestone

        return nodeFetch(`https://api.github.com/repos/${config.github.owner}/${config.github.repo}/issues`, {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Authorization': `token ${config.github.token}`,
                    'Accept':  'aapplication/vnd.github.symmetra-preview+json'
                }
            }
        )
        .then(res => res.json())
        .catch(res => console.error(res))
    }

    private _defaultApiFetch(endpoint : string, gitApiVersion : string = 'application/vnd.github.v3+json') {
        return nodeFetch(`https://api.github.com/repos/${config.github.owner}/${config.github.repo}/${endpoint}`, {
                method: 'GET',
                headers: {
                    'Authorization': `token ${config.github.token}`,
                    'Accept':  gitApiVersion
                }
            }
        )
        .then(res => res.json())
        .catch(res => console.error(res))
    }
}