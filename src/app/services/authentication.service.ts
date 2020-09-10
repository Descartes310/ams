import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user.model';
import * as URL from "../app-url";
import * as CONST from "../app-const";

import { HttpClient, HttpParams, HttpHeaders,  } from "@angular/common/http";
import { HttpClientModule } from '@angular/common/http'; 
import { HttpModule } from '@angular/http';
import { Role } from '../models/role.model';
import { Privilege } from '../models/privilege.model';

@Injectable()
export class AuthenticationService {
  constructor(
    private httpClient: HttpClient,
		private router: Router
	) {}

	public async forgotPassword(email: string): Promise<any> {
		return await this.httpClient
			.get(URL.FORGOT_PASSWORD + "?email=" + email)
			.toPromise();
	}


  public async login(username: string, password: string): Promise<boolean> {
    const params = new HttpParams()
      .set("grant_type", CONST.GRANT_TYPE_PASSWORD)
      .set("username", username)
			.set("password", password)
      .set("client_id", CONST.CLIEN_ID);

    const headers = new HttpHeaders()
      .set("Content-type", "application/x-www-form-urlencoded; charset=utf-8")
      .set("Authorization", "Basic " + btoa(CONST.CLIEN_ID + ":" + CONST.CLIENT_SECRET))
      .set("Accept", "application/json");
				
    return await this.httpClient
      .post(URL.OAUTH_TOKEN, params, {
        headers: headers,
        withCredentials: true
      })
      .toPromise()
      .then(token => {
        return this.storeTokenAndLoadUser(token);
      })
			.catch(err => {
        return Promise.resolve(false);
      });
  }

  public logout(redirectUrl: string = "/login"): void {
		if(this.isLogged()){
			this.httpClient.delete(URL.OAUTH_REVOKE_TOKEN, {params: {userId: ''+this.getUser().id}}).subscribe(() => {});
		}

		this.deleteStoredTokenAndUser();
		sessionStorage.clear();
		this.router.navigate([redirectUrl]);
	}

	public isLogged(): boolean {
		let currentUser = JSON.parse(sessionStorage.getItem(CONST.CURRENT_USER));
		let token = sessionStorage.getItem(CONST.TOKEN_VALUE);

		return Boolean(currentUser && token);
	}

	public isAdmin(): boolean {
		let user: User = this.getUser();
		let role: Role = user.roles.filter(
			role => role.name.toLocaleUpperCase() === "ADMIN"
		)[0];

		return role ? true : false ;
	}

	public refreshToken(): Promise<boolean> {
		const params = new HttpParams()
			.set("grant_type", CONST.GRANT_TYPE_REFRESH_TOKEN)
			.set("client_id", CONST.CLIEN_ID)
			.set("refresh_token", sessionStorage.getItem(CONST.TOKEN_REFRESH_VALUE))
			.set(CONST.IGNORE_LOG_PARAM, '1');	//we do not need to log refresh token operation

		const headers = new HttpHeaders()
			.set("Content-type", "application/x-www-form-urlencoded; charset=utf-8")
			.set("Authorization", "Basic " + btoa(CONST.CLIEN_ID + ":" + CONST.CLIENT_SECRET))
			.set("Accept", "application/json");

		return this.httpClient
			.post(URL.OAUTH_TOKEN, params, {
				headers: headers,
				withCredentials: true
			})
			.toPromise()
			.then(token => {
				return this.storeTokenAndLoadUser(token);
			})
			.catch(err => {
				return false;
			});
	}


	public getUser(): User {
		return JSON.parse(sessionStorage.getItem(CONST.CURRENT_USER));
	}

	public hasPrivilege(privilegeID: number, rejectCallback?: (() => void)): Promise<boolean> {

		if(!this.isLogged()){
			return Promise.resolve(false);
		}
		let url = URL.GET_PRIVILEGES;
		url += '?' + CONST.IGNORE_LOG_PARAM + '=1';
		return this.httpClient.get<Privilege[]>(url)
			.toPromise()
			.then( (privileges: Privilege[]) => {
				let result = false;
				privileges.forEach((privilege: Privilege) => {
					result = result || (privilege.id === privilegeID);
				});

				if(result){
					return true;
				}else{
					if (rejectCallback)
						rejectCallback();
					return false;
				}
			})
			.catch(err => {
				return false;
			});

	}

	public setUser(user: User): void {
		sessionStorage.setItem(CONST.CURRENT_USER, JSON.stringify(user));
	}

	public getAccessToken() {
		return sessionStorage.getItem(CONST.TOKEN_VALUE);
	}

	private async storeTokenAndLoadUser(token): Promise<boolean> {
		if (token && token.access_token) {
			if(this.isLogged()){
				this.saveToken(token);
				return true;
			}

			//load logged user details
			const headers = new HttpHeaders()
				.set("Content-type", "application/x-www-form-urlencoded; charset=utf-8")
				.set("Authorization", "Bearer " + token.access_token)
				.set("Accept", "application/json");
			let url = URL.CURRENT_USER;
			url += '?' + CONST.IGNORE_LOG_PARAM + '=1';
			let user = await this.httpClient.get<User>(url, {
						headers: headers,
						withCredentials: true
					})
					.toPromise<User>()
					.then(user => {
						return user;
					})
					.catch(err => {
						return null;
					});

			if (user) {
				// store user details and token in local storage to keep user logged in between page refreshes
				this.saveToken(token);
				this.saveUser(user);
				this.updateLastLogin();
				return true;
			}
		}
		
		return false;
	}

	public getTokenExpireDate(): Date {
		let exp = sessionStorage.getItem(CONST.TOKEN_EXPIRES_IN);
		return new Date(JSON.parse(exp));
	}

	private saveToken(token) {
		let expireDate = new Date().getTime() + 1000 * token.expires_in;
		sessionStorage.setItem(CONST.TOKEN_VALUE, token.access_token);
		sessionStorage.setItem(CONST.TOKEN_EXPIRES_IN, JSON.stringify(expireDate));

		sessionStorage.setItem(CONST.TOKEN_REFRESH_VALUE, token.refresh_token);

		sessionStorage.setItem(CONST.TOKEN_SCOPE, token.scope);
		sessionStorage.setItem(CONST.TOKEN_TYPE, token.token_type);
	}

	private saveUser(user: User) {
		sessionStorage.setItem(CONST.CURRENT_USER, JSON.stringify(user));
	}

	private deleteStoredTokenAndUser(): void {
		// remove user and token from local storage to log user out

		sessionStorage.removeItem(CONST.CURRENT_USER);

		sessionStorage.removeItem(CONST.TOKEN_VALUE);
		sessionStorage.removeItem(CONST.TOKEN_EXPIRES_IN);

		sessionStorage.removeItem(CONST.TOKEN_REFRESH_VALUE);

		sessionStorage.removeItem(CONST.TOKEN_SCOPE);
		sessionStorage.removeItem(CONST.TOKEN_TYPE);
	}

	public updateLastLogout() {
		let url = URL.UPDATE_LAST_LOGOUT;
		url += '?' + CONST.IGNORE_LOG_PARAM + '=1';
		this.httpClient.patch(url, {}).subscribe();
	}
	private updateLastLogin() {
		let url = URL.UPDATE_LAST_LOGIN;
		url += '?' + CONST.IGNORE_LOG_PARAM + '=1';
		this.httpClient.patch(url, {}).subscribe();
	}
}
