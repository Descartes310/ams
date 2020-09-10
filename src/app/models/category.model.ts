import { Metadata } from "./metadata.model";
import { Group } from "./group.model";

export class Category {
	id: number;
	name: string;
	description: string;
	metadatas: Metadata[];
	groups: Group[];
	isBlocked: Boolean;
	slug: string;
	createdAt: Date;
	updatedAt: Date;
}