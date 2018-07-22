import ServerSideComponent from "../../Core/Component/ServerSideComponent";
import express from "express";
import GithubService from "./GithubService";
import { LabelResponse, ContributerResponse, IssueResponse } from "./_shared/Models/GitHubResponses";

export interface IssueTrackerRepoInfo {
    issues: IssueResponse[]
    labels: LabelResponse[]
    contribs: ContributerResponse[]
}

export default class IssueTracker extends ServerSideComponent {
    
    protected get name() {
        return 'issue_tracker';
    };

    get service() {
        return this.getDependency<GithubService>('issue_tracker_service')
    }

    issues : IssueResponse[] = []
    labels : LabelResponse[] = []
    contribs : ContributerResponse[] = []
    
    init() {
        this.registerPrefixedForDI('service', GithubService)

        this.routePrefixed().get('/info', this.getInfo.bind(this));
        this.routePrefixed().post('/issues/create', this.createRepositoryIssue.bind(this));
    }
    
	index(req: express.Request, res: express.Response, next : express.NextFunction) {
    }
    
    getInfo(req: express.Request, res: express.Response, next : express.NextFunction) {
        // TODO implement https://www.npmjs.com/package/express-async-errors?
        this.getRepoInfo().then((info) => {
            res.send(info);
        });
    }
    
    createRepositoryIssue(req: express.Request, res: express.Response, next : express.NextFunction) {
        this.service.createIssue(req.body).then(users => {
            res.send(users);
        });
    }
    
    private async getRepoInfo() : Promise<IssueTrackerRepoInfo> {
        return {
            issues: await this.service.fetchIssues(),
            contribs: await this.service.fetchContributers(),
            labels: await this.service.fetchLabels()
        }
    }
}