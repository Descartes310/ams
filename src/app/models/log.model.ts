import { User } from "./user.model";

export class Log {
    id: number;
    user: User;
    description: string;
    url: string;
    remoteIp: string;
    method: string;
    statusText: string;
    statusCode: number;
    parameters: string;
    createdAt: Date;
    updatedAt: Date;
}
