import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Category } from "../models/category.model";
import * as URL from "../app-url";
import * as CONST from "../app-const";
import { AuthenticationService } from "../services/authentication.service";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Metadata } from "../models/metadata.model";
import { Group } from "../models/group.model";

@Injectable({
	providedIn: "root"
})
export class CategoryService {
	
	token = sessionStorage.getItem(CONST.TOKEN_VALUE);
	constructor(
		private httpClient: HttpClient,
		private authService: AuthenticationService
	) {}

	public async addCategory(
		name: string,
		slug: string,
		description: string,
		metadatas: any,
		groups: any
	): Promise<any> {
		if (this.authService.isLogged()) {
			const params = {
				name: name,
				slug: slug,
				description: description,
				metadatas: metadatas,
				groups: groups,
				isBlocked: false
			};
			return await this.httpClient
				.post(URL.ADD_CATEGORY, params)
				.toPromise();
		} else {
			return false;
		}
	}

	public async blockCategory(id: number, status: boolean): Promise<any> {
		if (this.authService.isLogged()) {
			const params = {
				id: id,
				isBlocked: status
			};
			return await this.httpClient
				.post(URL.BLOCK_CATEGORY, params)
				.toPromise();
		} else {
			return false;
		}
	}

	getCategoriesAdmin(): Observable<Array<Category>> {
		return this.httpClient.get<Array<Category>>(URL.ADMIN_CATEGORIES);
	}

	public async editCategory(
		name: string,
		slug: string,
		description: string,
		isBlocked: Boolean,
		metadatas: Metadata[],
		groups: Group[],
		id: number
	): Promise<any> {
		if (this.authService.isLogged()) {
			const params = new HttpParams()
				.set("id", ""+id)
				.set("name", name)
				.set("slug", slug)
				.set("description", description)
				.set("isBlocked", ""+isBlocked)
				.set("metadatas", "" + JSON.stringify(metadatas))
				.set("groups", "" + JSON.stringify(groups));
			
			return await this.httpClient
				.put(URL.EDIT_CATEGORY, {}, {params: params})
				.toPromise();
		} else {
			return false;
		}
	}

	getCategory(id: string): Observable<Category> {
		return this.httpClient.get<Category>(URL.CATEGORY + "/" + id);
	}

	public async deleteCategory(categoryId: number): Promise<any> {
		if (this.authService.isLogged()) {
			const params = {
				id: categoryId
			};
			return await this.httpClient
				.post(URL.DELETE_CATEGORY, params)
				.toPromise();
		} else {
			return false;
		}
	}

	getCategories(hideLog = false): Observable<Array<Category>> {
		let url = URL.CATEGORIES;
		if (hideLog) {
			url += "?" + CONST.IGNORE_LOG_PARAM + "=1";
		}
		return this.httpClient.get<Array<Category>>(url);
	}
}
