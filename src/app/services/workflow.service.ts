import { Injectable } from "@angular/core";
import { Workflow } from "../models/workflow.model";
import * as URL from "../app-url";
import * as CONST from "../app-const";
import { AuthenticationService } from "../services/authentication.service";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { Time } from "@angular/common";

@Injectable({
	providedIn: "root"
})
export class WorkflowService {
	constructor(
		private httpClient: HttpClient,
		private authService: AuthenticationService
	) {}

	public async addPlannification(
		name: string,
		date: Date,
		time: string,
		parameters: string
	): Promise<any> {
		if (this.authService.isLogged()) {
			const params = {
				name: name,
				date: date,
				time: time,
				task: "",
				parameters: parameters
			};
			return await this.httpClient
				.post(URL.ADD_PLANNIFICATION, params)
				.toPromise();
		} else {
			return false;
		}
	}

	public async block(id: number, status: boolean): Promise<any> {
		if (this.authService.isLogged()) {
			const params = {
				id: id,
				isActive: status
			};
			return await this.httpClient
				.post(URL.BLOCK_PLANNIFICATION, params)
				.toPromise();
		} else {
			return false;
		}
	}

	getPlannifications(): Observable<Array<Workflow>> {
		return this.httpClient.get<Array<Workflow>>(URL.PLANNIFICATIONS);
	}

	getPlannification(id: string): Observable<Workflow> {
		return this.httpClient.get<Workflow>(URL.PLANNIFICATION + "/" + id);
	}

	getNextPlannifications(): Observable<Array<Workflow>> {
		return this.httpClient.get<Array<Workflow>>(URL.NEXT_PLANNIFICATIONS);
	}

	public async editPlannification(
		name: string,
		date: Date,
		time: string,
		task: string,
		parameters: string,
		id: number
	): Promise<any> {
		if (this.authService.isLogged()) {
			const params = {
				name: name,
				date: date,
				time: time.substring(0, 5),
				task: task,
				parameters: parameters,
				id: id
			};
			return await this.httpClient
				.put(URL.EDIT_PLANNIFICATION, params)
				.toPromise();
		} else {
			return false;
		}
	}

	public async deletePlannification(
		plannificationId: number
	): Promise<any> {
		if (this.authService.isLogged()) {
			const params = {
				id: plannificationId
			};
			return await this.httpClient
				.post(URL.DELETE_PLANNIFICATION, params)
				.toPromise();
		} else {
			return false;
		}
	}
}
