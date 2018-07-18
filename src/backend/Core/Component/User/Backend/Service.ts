import UserRepository from './Repository';
import { Guid } from 'guid-typescript';

export default class UserService {

	private _repository : UserRepository;

	constructor() {
		this._repository = new UserRepository(); 
	}

	getUserById(id : Guid) {
		return this._repository.getById(id);
	}

	getUserByNameAndHash(username : string, passwordHash : string) {
		return this._repository.get().filter((u) => {
			return u.username === username && u.passwordHash === passwordHash;
		})[0];
	}

}

