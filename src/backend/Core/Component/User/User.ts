import DiContainer from "../../DiContainer";
import ServerSideComponent from "../ServerSideComponent";
import { Request, Response } from 'express-serve-static-core';

import UserService from "./Backend/Service";

export default class Users extends ServerSideComponent {
    
	protected name = 'users';

	get service() {
		return this.getDependency('users_UserService') as UserService;
	}; 
    
    init() {
		this.registerPrefixedForDI('UserService', UserService);

        this.routePrefixed().get('/login/:username/:hash', this.loginByLink.bind(this));
		this.routePrefixed().get('/current', this.getCurrentUser.bind(this));
    }

	getCurrentUser(req : Request, res : Response) {
		if (req.session && req.session.user) {
			res.send(req.session.user);
			return;
		}

		res.send({});
	}

	loginByLink(req : Request, res : Response) {
		let user = this.service.getUserByNameAndHash(req.params.username, req.params.hash);
	
		if (req.session) {
			req.session.user = user;
		}
	
		res.redirect('/');
	}

}