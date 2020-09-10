import { Injectable } from '@angular/core';
import { Archive } from '../models/archive.model';
import * as URL from '../app-url';
import * as CONST from '../app-const';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { LoadResourceService } from './load-resource.service';
import { Utils } from '../app-utils';

@Injectable({
	providedIn: "root"
})
export class ArchiveService {
	constructor(
		private httpClient: HttpClient,
    private loadResourceService: LoadResourceService
	) {}

	public getById(archiveId): Observable<Archive> {
		const url = URL.GET_ARCHIVE_BY_ID.replace("{id}", archiveId);
		return this.httpClient.get<Archive>(url);
	}

	public allOfGroup(groupId, hideLog = false): Observable<Array<Archive>> {
		let url = URL.GROUP_ARCHIVES.replace("{id}", groupId);
		if (hideLog) {
			url += "?" + CONST.IGNORE_LOG_PARAM + "=1";
		}
		return this.httpClient.get<Array<Archive>>(url);
	}

	public allOfCategory(
		categoryId,
		hideLog = false
	): Observable<Array<Archive>> {
		let url = URL.CATEGORY_ARCHIVES.replace("{id}", categoryId);
		if (hideLog) {
			url += "?" + CONST.IGNORE_LOG_PARAM + "=1";
		}
		return this.httpClient.get<Array<Archive>>(url);
	}

	public allOfUser(): Observable<Array<Archive>> {
		const url = URL.USER_ARCHIVES;
		return this.httpClient.get<Array<Archive>>(url + "?page=1&size=1000000");
	}

	public search(params) {
		return this.httpClient.get<Array<Archive>>(URL.SEARCH_ARCHIVE, {
			params: params
		});
	}

	public delete(archiveId) {
		const url = URL.SOFT_DELETE_ARCHIVE.replace("{id}", archiveId);
		return this.httpClient.delete(url);
	}

	public deleteHard(archiveId) {
		const url = URL.HARD_DELETE_ARCHIVE.replace("{id}", archiveId);
		return this.httpClient.delete(url);
	}

	public download(archive: Archive, filename?: string) {
		if (!filename) filename = archive.path;
		this.loadResourceService.loadPDF(archive.path, archive.category.slug).subscribe(res => {
			Utils.download(res, filename);
		});
	}

	public trashed(): Observable<Array<Archive>> {
		return this.httpClient.get<Array<Archive>>(URL.TRASHED_ARCHIVE);
	}

	public restore(archiveId) {
		const url = URL.RESTORE_ARCHIVE.replace("{id}", archiveId);
		return this.httpClient.delete(url);
	}

	public restoreAll(password: string, since: number) {
		let params = new HttpParams()
			.set("password", password)
			.set("since", since ? "" + since : "0");

		return this.httpClient.delete(URL.RESTORE_ALL_ARCHIVE, { params: params });
	}

	public getDeletedAt(archiveId) {
		let url = URL.ARCHIVE_GET_DELETED_AT.replace("{id}", archiveId);
		url += "?" + CONST.IGNORE_LOG_PARAM + "=1";
		return this.httpClient.get(url);
	}

	public getSinceLastLogout(): Observable<Archive[]> {
		let url = URL.ARCHIVES_SINCE_LAST_LOGOUT;
		url += "?" + CONST.IGNORE_LOG_PARAM + "=1";
		return this.httpClient.get<Archive[]>(url);
	}

}
