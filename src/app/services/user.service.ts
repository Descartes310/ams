import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Role } from "../models/role.model";
import * as URL from "../app-url";
import * as CONST from "../app-const";
import { AuthenticationService } from "../services/authentication.service";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { PrivilegeService } from "./privilege.service";
import { User } from "../models/user.model";

@Injectable({
	providedIn: "root"
})
export class UserService {
	constructor(
		private httpClient: HttpClient,
		private router: Router,
		private authService: AuthenticationService
	) {}

	getUsers(): Observable<Array<User>> {
		return this.httpClient.get<Array<User>>(URL.USERS);
	}


	list(): Observable<User[]>{
		return this.httpClient.get<User[]>(URL.USER_LIST);
	}

	public async blockUser(id: number, status: boolean): Promise<any> {
		if (this.authService.isLogged()) {
			const params = {
				id: id,
				isBlocked: status
			};
			return await this.httpClient
				.post(URL.BLOCK_USER, params)
				.toPromise();
		} else {
			return false;
		}
	}

	getUser(id: string): Observable<User> {
		return this.httpClient.get<User>(URL.USER + "/" + id);
	}

	public async deleteUser(userId: number): Promise<any> {
		if (this.authService.isLogged()) {
			const params = {
				id: userId
			};
			return await this.httpClient
				.post(URL.DELETE_USER, params)
				.toPromise();
		} else {
			return false;
		}
	}

	public async addUser(
		firstName: string,
		lastName: string,
		email: string,
		login: string,
		password: string,
		telephone: string,
		grade: string,
		groups: any,
		roles: any
	): Promise<any> {
		if (this.authService.isLogged()) {
			const params = {
				firstName: firstName,
				lastName: lastName,
				email: email,
				login: login,
				password: password,
				telephone: telephone,
				grade: grade,
				isBlocked: false,
				groups: groups,
				roles: roles
			};
			console.log(groups, roles);
			return await this.httpClient
				.post(URL.ADD_USER, params)
				.toPromise();
		} else {
			return false;
		}
	}

	public async editUser(
		firstName: string,
		lastName: string,
		email: string,
		login: string,
		password: string,
		telephone: string,
		grade: string,
		groups: any,
		roles: any,
		id: number
	): Promise<any> {
		if (this.authService.isLogged()) {
			const params = {
				firstName: firstName,
				lastName: lastName,
				email: email,
				login: login,
				password: password,
				telephone: telephone,
				grade: grade,
				isBlocked: false,
				groups: groups,
				roles: roles,
				id: id
			};
			return await this.httpClient
				.put(URL.EDIT_USER, params)
				.toPromise();
		} else {
			return false;
		}
	}

	/* public async removeGroupMember(groupId: number, userId: number) {
		return await this.httpClient.get(
			URL.REMOVE_GROUP_MEMBER + "?groupId=" + groupId + "&userId=" + userId
		);
	} */
	public update(model): Observable<User> {
		return this.httpClient.put<User>(URL.UPDATE_USER, {}, { params: model });
	}

	public changePassword(model: {
		password: string;
		oldPassword: string;
	}): Observable<any> {
		return this.httpClient.patch<any>(
			URL.CHANGE_PASSWORD,
			{},
			{ params: model }
		);
	}
}
