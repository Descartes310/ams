import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticationService } from "../services/authentication.service";

@Injectable()
export class AddTokenInterceptor implements HttpInterceptor {

  constructor(private authService: AuthenticationService){}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // add authorization header with token if available
		if (this.authService.isLogged() && !request.headers.get('Authorization')) {
      request = request.clone({
				setHeaders: {
					Authorization: `Bearer ${this.authService.getAccessToken()}`
        },
        withCredentials: false
			});
    }
    console.log(request);
    return next.handle(request);
  }
}
