import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Storage } from "../models/storage.model";
import * as URL from "../app-url";
import * as CONST from "../app-const";
import { AuthenticationService } from "../services/authentication.service";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { Setting } from "../models/setting.model";

@Injectable({
	providedIn: "root"
})
export class StorageService {
	constructor(
		private httpClient: HttpClient,
		private router: Router,
		private authService: AuthenticationService
	) {}

	public async addStorage(
		name: string,
		address: string,
		path: string,
		type: string
	): Promise<any> {
		if (this.authService.isLogged()) {
			const params = {
				name: name,
				address: address,
				path: path,
				type: type,
				isActive: true
			};
			return await this.httpClient.post(URL.ADD_STORAGE, params).toPromise();
		} else {
			return false;
		}
	}

	getStorages(): Observable<Array<Storage>> {
		return this.httpClient.get<Array<Storage>>(URL.STORAGES);
	}

	getStorage(id: string): Observable<Storage> {
		return this.httpClient.get<Storage>(URL.STORAGE + "/" + id);
	}

	public async editStorage(
		name: string,
		address: string,
		path: string,
		type: string,
		status: boolean,
		isActive: boolean,
		id: number
	): Promise<any> {
		if (this.authService.isLogged()) {
			const params = {
				name: name,
				address: address,
				path: path,
				type: type,
				status: status,
				isActive: isActive,
				id: id
			};
			return await this.httpClient.put(URL.EDIT_STORAGE, params).toPromise();
		} else {
			return false;
		}
	}

	public async disableStorage(id: number, status: boolean): Promise<any> {
		if (this.authService.isLogged()) {
			const params = {
				id: id,
				status: status
			};
			return await this.httpClient.post(URL.ACTIVE_STORAGE, params).toPromise();
		} else {
			return false;
		}
	}

	public async replicate(
		id: number,
		login: string,
		password: string
	): Promise<any> {
		return await this.httpClient
			.get(
				URL.REPLICATE +
					"?serverId=" +
					id +
					"&login=" +
					login +
					"&password=" +
					password
			)
			.toPromise();
	}

	public getAllTypes(): Observable<Setting> {
		let url = URL.TYPES_OF_FILES;
		return this.httpClient.get<Setting>(url);
	}

	public async editTypes(types: any): Promise<any> {
		if (this.authService.isLogged()) {
			const params = {
				typeOfFiles: types
			};
			console.log(types.toString());
			return await this.httpClient
				.get(URL.EDIT_TYPES_OF_FILES + "?types=" + types)
				.toPromise();
		} else {
			return false;
		}
	}

	/*   public async deleteStorage(storageId: number): Promise<boolean> {
    if (this.authService.isLogged()) {
      const params = { id: storageId };
      return await this.httpClient
        .post(URL.DELETE_STORAGE, params)
        .toPromise()
        .then(storage => {
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