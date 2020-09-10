import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Role } from "../models/role.model";
import * as URL from "../app-url";
import * as CONST from "../app-const";
import { AuthenticationService } from "../services/authentication.service";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { PrivilegeService } from "./privilege.service";

@Injectable({
	providedIn: "root"
})
export class RoleService {
	token = sessionStorage.getItem(CONST.TOKEN_VALUE);
	constructor(
		private httpClient: HttpClient,
		private router: Router,
		private authService: AuthenticationService
	) {}

	public async addRole(
		name: string,
		description: string,
		privileges: any,
		users: any
	): Promise<any> {
		if (this.authService.isLogged()) {
			const params = {
				name: name,
				description: description,
				privileges: privileges,
				users: users
			};
			return await this.httpClient
				.post(URL.ADD_ROLE, params)
				.toPromise();
		} else {
			return false;
		}
	}

	getRoles(): Observable<Array<Role>> {
		return this.httpClient.get<Array<Role>>(URL.ROLES);
	}

	public async editRole(
		name: string,
		description: string,
		privileges: any,
		users: any,
		id: number
	): Promise<any> {
		if (this.authService.isLogged()) {
			const params = {
				name: name,
				description: description,
				privileges: privileges,
				users: users,
				id: id
			};
			return await this.httpClient
				.put(URL.EDIT_ROLE, params)
				.toPromise();
		} else {
			return false;
		}
	}

	getRole(id: string): Observable<Role> {
		return this.httpClient.get<Role>(URL.ROLE + "/" + id);
	}

	public async deleteRole(roleId: number): Promise<any> {
		if (this.authService.isLogged()) {
			const params = {
				id: roleId
			};
			return await this.httpClient
				.post(URL.DELETE_ROLE, params)
				.toPromise();
		} else {
			return false;
		}
	}
}
