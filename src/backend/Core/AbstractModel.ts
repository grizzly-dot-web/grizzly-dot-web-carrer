import { Guid } from "guid-typescript";

export default interface AbstractObject {
    id : string|Guid|null,
}