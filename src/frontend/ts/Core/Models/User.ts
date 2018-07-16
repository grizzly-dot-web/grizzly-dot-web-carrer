import AbstractModel from "./AbstractModel";
import UserRole from "./UserRole";

export default interface UserObj extends AbstractModel {
    
    username : string

    roles : UserRole[]

    passwordHash : string

}