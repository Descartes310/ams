import { Injectable } from '@angular/core';
import { Privilege } from '../models/privilege.model';
import * as URL from "../app-url";
import { IGNORE_LOG_PARAM } from "../app-const";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class PrivilegeService {
  constructor(
    private httpClient: HttpClient
  ) {}

  getPrivileges(): Observable<Array<Privilege>> {
		let url = URL.GET_PRIVILEGES;
		url += '?' + IGNORE_LOG_PARAM + '=1';
    return this.httpClient.get<Array<Privilege>>(url);
  }

  getAllPrivileges(): Observable<Array<Privilege>> {
    return this.httpClient.get<Array<Privilege>>(URL.PRIVILEGES);
  }


}
