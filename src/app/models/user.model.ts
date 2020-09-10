import { Group } from "./group.model";
import { Role } from "./role.model";

export class User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    login: string;
    password: string;
    telephone: number;
    grade: string;
    isBlocked: boolean;
    avatar: string;
    roles: Role[];
    groups: Group[];
    lastLogin: Date;
    lastLogout: Date;
    createdAt: Date;
    updatedAt: Date;
}
