import ServerSideComponent from "../ServerSideComponent";
import { Request, Response } from 'express-serve-static-core';

import UserService from "./Backend/Service";
import { NextFunction } from "express";

export default class Users extends ServerSideComponent {
    
	protected name = 'users';

	get service() {
		return this.getDependency('users_UserService') as UserService;
	}; 
    
    init() {
		this.registerPrefixedForDI('UserService', UserService);

		this.routePrefixed().get('/current', this.getCurrentUser.bind(this));
        this.routePrefixed().get('/login/:username/:hash', this.loginByLink.bind(this));
	}
	
	index(req: Request, res: Response, next : NextFunction): void {
	}

	getCurrentUser(req : Request, res : Response, next : NextFunction) {
		if (req.session && req.session.user) {
			return res.send(req.session.user);
		}

		return res.send(false);
	}

	loginByLink(req : Request, res : Response, next : NextFunction) {
		console.log('loginByLink entered')
		let user = this.service.getUserByNameAndHash(req.params.username, req.params.hash);
	
		console.log(user);
		if (req.session) {
			req.session.user = user;
		}
	
		res.redirect('/');
	}

}