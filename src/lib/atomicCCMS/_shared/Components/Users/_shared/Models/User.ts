import UserRole from "./UserRole";
import AbstractModel from "../../../../../server/Models/AbstractModel";

export default interface User extends AbstractModel {
    
    username : string

    roles : UserRole[]

    passwordHash : string

}