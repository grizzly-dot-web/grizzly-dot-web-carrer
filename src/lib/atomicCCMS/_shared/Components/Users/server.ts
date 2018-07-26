import { NextFunction, Request, Response } from "express";

import AtomicComponent from '../Abstract/AtomicComponent/server';
import UserService from './server/Service';

export default class Users extends AtomicComponent {
    
    protected get name() {
        return 'users';
    };

	get service() {
		return this.getDependency('users_UserService') as UserService;
	}; 
    
    init() {
		this.registerPrefixedForDI('UserService', UserService);

		this.routePrefixed().get('/current', this.getCurrentUser.bind(this));
		this.routePrefixed().get('/login/:username/:hash', this.loginByLink.bind(this));
		
		return this;
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
		let user = this.service.getUserByNameAndHash(req.params.username, req.params.hash);
	
		if (req.session) {
			req.session.user = user;
		}
	
		res.redirect('/');
	}

}