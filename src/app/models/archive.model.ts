import { Category } from "./category.model";
import { Group } from "./group.model";
import { User } from "./user.model";

export class Archive {
		id: number;
		name: string;
    path: string;
    cover: string;
		size: string;
		category: Category;
		groups: Group[];
		interests: User[];
		metadataValues: any[];
    archivistName: string;
    archivistGrade: string;
    archivistTelephone: string;
    createdAt: Date;
    updatedAt: Date;
}
