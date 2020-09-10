import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Metadata } from "../models/metadata.model";
import * as URL from "../app-url";
import * as CONST from "../app-const";
import { AuthenticationService } from "../services/authentication.service";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { Observable } from 'rxjs';

@Injectable({
  providedIn: "root"
})
export class MetadataService {
  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private authService: AuthenticationService,
  ) {}

  public async addMetadata(name: string, label: string, type: string): Promise<any> {
    if (this.authService.isLogged()) {
      const params = {
        name: name,
        label: label,
        type: type
      };
      return await this.httpClient
        .post(URL.ADD_METADATA, params)
        .toPromise();
    } else {
      return false;
    }
  }

  getMetadatas(): Observable<Array<Metadata>> {
    return this.httpClient.get<Array<Metadata>>(URL.METADATAS);
  }

  public async editMetadata(
    name: string,
    label: string,
    type: string,
    id: number
  ): Promise<any> {
    if (this.authService.isLogged()) {
      const params = {
        name: name,
        label: label,
        type: type,
        id: id
      };
      return await this.httpClient
        .put(URL.EDIT_METADATA, params)
        .toPromise();
    } else {
      return false;
    }
  }

  getMetadata(id: string): Observable<Metadata> {
    return this.httpClient.get<Metadata>(URL.METADATA + "/" + id);
  }

  public async deleteMetadata(metadataId: number): Promise<any> {
    if (this.authService.isLogged()) {
      const params = { id: metadataId };
      return await this.httpClient
        .post(URL.DELETE_METADATA, params)
        .toPromise();
    } else {
      return false;
    }
  }

  all(): Observable<Array<Metadata>> {
		let url = URL.METADATA_LIST;
		url += '?' + CONST.IGNORE_LOG_PARAM + '=1';
    return this.httpClient.get<Array<Metadata>>(url);
  }


  public getMetadataValues(archiveId): Observable<Array<any>> {
		let url = URL.ARCHIVE_METADATA_VALUE.replace('{id}', archiveId);
		url += '?' + CONST.IGNORE_LOG_PARAM + '=1';
    return this.httpClient.get<Array<any>>(url);
  }
}
