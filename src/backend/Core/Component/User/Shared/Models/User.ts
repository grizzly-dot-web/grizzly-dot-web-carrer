import UserRole from "./UserRole";
import AbstractModel from "../../../../AbstractModel";

export default interface User extends AbstractModel {
    
    username : string

    roles : UserRole[]

    passwordHash : string

}