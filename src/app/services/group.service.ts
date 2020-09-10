import { Injectable } from "@angular/core";
import { Group } from "../models/group.model";
import * as URL from "../app-url";
import * as CONST from "../app-const";
import { AuthenticationService } from "../services/authentication.service";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
	providedIn: "root"
})
export class GroupService {
	
	constructor(
		private httpClient: HttpClient,
		private authService: AuthenticationService
	) {}

	public async addGroup(name: string, description: string): Promise<any> {
		if (this.authService.isLogged()) {
			const params = {
				name: name,
				description: description
			};
			return await this.httpClient
				.post(URL.ADD_GROUP, params)
				.toPromise();
		} else {
			return false;
		}
	}

	getGroups(): Observable<Array<Group>> {
		return this.httpClient.get<Array<Group>>(URL.GROUPS);
  }
  
	userGroups(hideLog = false): Observable<Array<Group>> {
		let url = URL.USER_GROUPS;
		if(hideLog){
			url += '?'+CONST.IGNORE_LOG_PARAM+'=1';
		}
		return this.httpClient.get<Array<Group>>(url);
	}

	categoryGroups(categoryId, hideLog = false): Observable<Array<Group>> {
		let url = URL.CATEGORY_GROUPS.replace("{id}", categoryId);
		if(hideLog){
			url += '?'+CONST.IGNORE_LOG_PARAM+'=1';
		}
		return this.httpClient.get<Array<Group>>(url);
	}

	getGroup(id: string): Observable<Group> {
		return this.httpClient.get<Group>(URL.GROUP + "/" + id);
	}

	public async editGroup(
		name: string,
		description: string,
		users: any,
		id: number
	): Promise<any> {
		if (this.authService.isLogged()) {
			const params = {
				name: name,
				description: description,
				users: users,
				id: id
			};
			return await this.httpClient
				.put(URL.EDIT_GROUP, params)
				.toPromise();
		} else {
			return false;
		}
	}

	public async deleteGroup(groupId: number): Promise<any> {
		if (this.authService.isLogged()) {
			const params = {
				id: groupId
			};
			return await this.httpClient
				.post(URL.DELETE_GROUP, params)
				.toPromise();
		} else {
			return false;
		}
	}

/* 	public async addGroupMember(
		groupId: number,
		memberId: number
	): Promise<boolean> {
		if (this.authService.isLogged()) {
			const params = {
				groupId: groupId,
				memberId: memberId
			};
			return await this.httpClient
				.put(URL.ADD_GROUP_MEMBER, params)
				.toPromise()
				.then(group => {
					return true;
				})
				.catch(err => {
					return false;
				});
		} else {
			return false;
		}
	} */
}
