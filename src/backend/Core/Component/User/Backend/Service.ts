import UserRepository from './Repository';
import { Guid } from 'guid-typescript';
import User from '../Shared/Models/User';
import UserRole from '../Shared/Models/UserRole';

export default class UserService {

	private _repository : UserRepository;

	constructor() {
		this._repository = new UserRepository(); 
	}

	getDefaultUser() : User {
		return {
			id: null,
			username: 'unknown',
			passwordHash: 'unknown',
			roles: [
				this.getDefaultRole()
			]
		}
	}

	getDefaultRole() : UserRole {
		return {
			id: null,
			name: 'Arbeitgeber'
		}
	}

	getUserById(id : Guid|string) {
		let guid = id as Guid;

		if (!Guid.isGuid(id)) {
			guid = Guid.parse(id as string);
		}

		return this._repository.getById(guid);
	}

	getUserByNameAndHash(username : string, passwordHash : string) {
		return this._repository.get().filter((u) => {
			return u.username === username && u.passwordHash === passwordHash;
		})[0];
	}

}

