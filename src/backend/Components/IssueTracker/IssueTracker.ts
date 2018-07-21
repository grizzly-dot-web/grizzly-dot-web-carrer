import ServerSideComponent from "../../Core/Component/ServerSideComponent";
import express from "express";
import config from 'config-yml';
import infoGraphQL from "./_shared/Models/GraphQlQueries";
import GitHubInfoResponse from "./_shared/Models/GitHubInfoResponse";
import fetch from 'node-fetch';

const infoGraphRequsetBody = `
{
    user(login:"sebgrizzly") {
        name
    }   
}
  
`

export default class IssueTracker extends ServerSideComponent {
    
    private _repoInfo? : GitHubInfoResponse 

    protected get name() {
        return 'issue_tracker';
    };
    
    protected mediaType = 'application/vnd.github.symmetra-preview+json'

    init() {
        this.routePrefixed().get('/info', this.getRepositoryInfos.bind(this));
        this.routePrefixed().post('/create', this.createRepositoryIssue.bind(this));
    
        this.fetchRepoInfo();
	}
    
    fetchRepoInfo() {
        if (this._repoInfo) {
            return this._repoInfo;
        }

        let modified = infoGraphRequsetBody.replace(/\s/g, '');
        fetch('https://api.github.com/graphql', {
                method: 'POST',
                body: JSON.stringify({modified}),
                headers: {
                    'Authorization': `Bearer ${config.github.token}`,
                    'Accept':  'application/vnd.github.v4.idl'
                }
            }
        )
        .then(res => res.json())
        .then(json => this._repoInfo = json) 
        .catch(error => this._repoInfo = error);

        return this._repoInfo;
    }

	index(req: express.Request, res: express.Response, next : express.NextFunction) {
    }

    getRepositoryInfos(req: express.Request, res: express.Response, next : express.NextFunction) {
        return res.send({});
    }
    
    createRepositoryIssue(req: express.Request, res: express.Response, next : express.NextFunction) {
        console.log('req.body', req.body)
        res.send(req.body);
    }
}