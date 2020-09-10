import { User } from "./user.model";

export class Group {
    id: number;
    name: string;
    description: string;
		users: User[];
		createdAt: Date;
		updatedAt: Date;
}
