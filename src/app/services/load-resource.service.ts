import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as URL from "../app-url";
import * as CONST from "../app-const";

import { HttpClient, HttpParams, HttpHeaders, HttpRequest } from "@angular/common/http";
import { Observable } from 'rxjs';
import { AuthenticationService } from './authentication.service';
import { RequestOptions } from '@angular/http';

@Injectable()
export class LoadResourceService {
  constructor(private httpClient: HttpClient, private router: Router, private authService: AuthenticationService) { }

  public loadCover(cover: string, category: string = null): Observable<Blob> {

    const options: {
      headers?: HttpHeaders | {
        [header: string]: string | string[];
      };
      observe?: "body";
      params?: HttpParams | {
        [param: string]: string | string[];
      };
      reportProgress?: boolean;
      responseType: "blob";
      withCredentials?: boolean;
    } = {
      headers: {
        'response-type': 'blob'
      },
      params: {
        'cover': cover
      },
      responseType: 'blob'
    }

    let url = URL.COVER_RESOURCE;
    url += `?${CONST.IGNORE_LOG_PARAM}=true&category=${category}`;
    return this.httpClient.get(url, options);
    //return this.httpClient.get("https://picsum.photos/200/300/?random", options); //this is an endpoint to random image
  }


  public loadPDF(pdf: string, category: string = null): Observable<Blob> {

    const options: {
      headers?: HttpHeaders | {
        [header: string]: string | string[];
      };
      observe?: "body";
      params?: HttpParams | {
        [param: string]: string | string[];
      };
      reportProgress?: boolean;
      responseType: "blob";
      withCredentials?: boolean;
    } = {
      headers: {
        'response-type': 'blob'
      },
      params: {
        'pdf': pdf
      },
      responseType: 'blob'
    }

    let url = URL.PDF_RESOURCE;
    url += `?${CONST.IGNORE_LOG_PARAM}=true&category=${category}`;
    return this.httpClient.get(url, options);
  }



  public loadAvatar(avatar): Observable<Blob> {
    const options: {
      headers?: HttpHeaders | {
        [header: string]: string | string[];
      };
      observe?: "body";
      params?: HttpParams | {
        [param: string]: string | string[];
      };
      reportProgress?: boolean;
      responseType: "blob";
      withCredentials?: boolean;
    } = {
      headers: {
        'response-type': 'blob'
      },
      responseType: 'blob'
    }

    let url = URL.USER_AVATAR;
		url += `?${CONST.IGNORE_LOG_PARAM}=true`;
    return this.httpClient.get(url, options);
  }



  public exportToZip(fileToExport: string[]) {

    const params = new HttpParams().set('param', JSON.stringify(fileToExport));
    const req = new HttpRequest('GET', URL.EXPORT_ARCHIVES, {}, {
      reportProgress: true,
      responseType: "blob",
      params: params
    });

    return this.httpClient.request(req);

  }
}
