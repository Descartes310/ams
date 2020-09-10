import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthenticationService } from '../services/authentication.service';
import { AlertService } from '../services/alert.service';
import * as URL from '../app-url';
import * as CONST from '../app-const';
import { Router } from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

	private static CUR_REQ_SESSION_VARNAME = 'ErrorInterceptor.CUR_REQ_SESSION_VARNAME';
	private static showMessage = true;

	constructor(
		private router: Router,
    private alertService: AlertService,
    private authService: AuthenticationService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		request = request.clone({
			withCredentials: false
		});
		console.log(request);
		sessionStorage.setItem(ErrorInterceptor.CUR_REQ_SESSION_VARNAME, JSON.stringify(request));
		return next.handle(request)
		.pipe(map( (data: HttpResponse<any>) => {
			console.log(data);
			return data;
		}))
		.pipe(catchError( (err) => {
			console.log(err);
			// We don't want to refresh token for some requests like login or refresh token itself
			// So we verify url and we throw an error if it's the case
			if (request.url.includes(URL.OAUTH_TOKEN)) {
				if (request.body.grant_type == 'refresh_token') {
					return this.logout();
				}
				return this.errorToMessage(err);
			}

			if (request.url.includes("login")){
				return this.errorToMessage(err);
			}
			
			if (err && err.error && err.error.error === 'invalid_grant') {
				if (request.body.grant_type == 'refresh_token') {
					return this.logout();
				}
				return this.errorToMessage(err);
			}

			if (err && (err.status === 0 || err.status === 401)) { // auto logout if 401 response returned from api and refresh token fail
				
				let now = new Date();
				let exp = this.authService.getTokenExpireDate();
				if (now.getTime() < exp.getTime()) {
					return this.logout();
				}
				ErrorInterceptor.showMessage = false;
				return this.authService.refreshToken()
					.then(b => {
						if (b){
							let targetUrl = sessionStorage.getItem(CONST.CURRENT_URL_SESSION_VARNAME);
							let req: HttpRequest<any> = JSON.parse(sessionStorage.getItem(ErrorInterceptor.CUR_REQ_SESSION_VARNAME));
							if (location.href != targetUrl){
								this.router.navigate([targetUrl]);
								return [];
							}
							return next.handle(req);
						}else
							return this.logout();
					})
					.catch(err => {
						return this.logout();
					});
      }else{
				return this.errorToMessage(err);
			}

    }));
	}
	

	logout(): any[]{
		if (ErrorInterceptor.showMessage)
			this.alertService.error('Votre session est arrivée à expiration !');
		else
			ErrorInterceptor.showMessage = true;
		this.authService.logout();
		return [];
	}

	
	errorToMessage(err): Observable<any>{
		const error = err.error.message || err.statusText;
		return throwError(error);
	}

}
