import { Injectable } from "@angular/core";
import * as URL from "../app-url";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { User } from "../models/user.model";
import { Log } from "../models/log.model";
import { Observable } from "rxjs";
import { AuthenticationService } from "./authentication.service";

@Injectable({
  providedIn: "root"
})
export class LogService {
  constructor(
    private httpClient: HttpClient,
    private authService: AuthenticationService
  ) {}

  getLogs(
    startDate: string,
    endDate: string,
    user: number,
    status: string,
    action: string
  ): Observable<Array<Log>> {
    return this.httpClient.get<Array<Log>>(
      URL.LOGS +
        "?startDate=" +
        startDate +
        "&endDate=" +
        endDate +
        "&user=" +
        user +
        "&status=" +
        status +
        "&action=" +
        action
    );
  }

  public async deleteLog(logId: number): Promise<any> {
    const params = { id: logId };
    return await this.httpClient
      .post(URL.DELETE_LOG, params)
      .toPromise();
  }

  public async deleteManyLogs(logs: Log[]): Promise<any> {
    
    return await this.httpClient
      .post(URL.DELETE_LOGS, logs)
      .toPromise();
  }
}
