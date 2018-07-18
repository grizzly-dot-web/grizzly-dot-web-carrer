import { Guid } from 'guid-typescript';

import { users } from '../../../../to-be-migrated';
import User from '../Shared/Models/User';

export default class UserRepository {

    _users : User[]

    constructor() {
        this._users = users;
    }

    get() : User[] {
        return this._users;
    }

    getById(id : Guid) : User {
        let users = this._users.filter((u) => {
            u.id === id
        });

        return users[0];
    }
}