import { Guid } from "guid-typescript";

interface IRestfulApi<T> {

    get() : T[]

    get(id : any) : T

    post(id : Guid) : void

    post(id : Guid) : void

    delete(id : Guid) : void

}