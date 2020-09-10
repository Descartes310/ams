import { Privilege } from "./privilege.model";
import { User } from "./user.model";

export class Role {
    id: number;
    name: string;
    description: string;
    privileges: Privilege[];
    users: User[];
    createdAt: Date;
    updatedAt: Date;
}
