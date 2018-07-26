import crypto from "crypto";
import { Guid } from "guid-typescript";
import UserRole from "../_shared/Models/UserRole";
import User from "../_shared/Models/User";


let sha512 = function(password : string, salt : string) {
    var hash = crypto.createHmac('sha512', salt);
    hash.update(password);
    var value = hash.digest('hex');

    return value;
};
// TODO refactor save user in database
// TODO save salt with user to regenerate a new salt per user 

let createUser = (id : Guid, username : string, password : string, roles: UserRole[], salt = 'E9F8F88780048FDA912BBE0D6AA822C89C2CDA5B0F7CED951392ED132C887FEB') => {
   
}

const roles : { [key:string] : UserRole} = {
    arbeitgeber: {
        id: Guid.parse('a1af9773-1152-fe71-abfb-576d08a2796d'),
        name: 'Arbeitgeber'
    },

    kunde: {
        id: Guid.parse('13e158eb-70cf-b276-3fc2-4c79f3bf5924'),
        name: 'Kunde'
    },

    admin: {
        id: Guid.parse('db78d18e-041c-00ed-ec27-0fa2f123fd88'),
        name: 'Admin'
    },

};

const users : User[]= [
    {
        id: '1cd990c2-9a30-bf70-2aec-ee61d801b18f',
        username: 'admin',
        passwordHash: 'sebgrizzly-admin',
        roles: [ roles.admin ]
    },
    {
        id: 'b1c1aea3-8de9-c115-ad18-81e221bc4f79',
        username: 'AOE',
        passwordHash: '95d1f66a657d5e79ada6e54c0b6f8de2',
        roles: [ roles.admin ]
    },
    {
        id: '1cd990c2-9a30-bf70-2aec-ee61d801b18f',
        username: 'Sipgate',
        passwordHash: 'ab714a7439a4a6791ea8622855a1732e',
        roles: [ roles.admin ]
    }
];

const defaultUser = {
    id: '',
    username: 'default',
    passwordHash: '',
    roles: [ roles.arbeitgeber ]
}

export {users, defaultUser};