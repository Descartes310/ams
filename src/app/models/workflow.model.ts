import { Time } from "@angular/common";

export class Workflow {
    id: number;
    name: string;
    parameters: string;
    date: Date;
    task: string;
    time: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
