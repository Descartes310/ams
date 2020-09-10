import { Injectable } from "@angular/core";
import {
	Router,
	CanActivate,
	ActivatedRouteSnapshot,
	RouterStateSnapshot
} from "@angular/router";
import { Observable } from "rxjs";
import { AuthenticationService } from "../services/authentication.service";
import { AlertService } from "../services/alert.service";

@Injectable({
	providedIn: "root"
})
export class UserGuard implements CanActivate {
	private alert: AlertService;
	constructor(
		private router: Router,
		private authService: AuthenticationService,
		private alertService: AlertService
	) {
		this.alert = alertService;
	}

	canActivate(
		next: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	): Observable<boolean> | Promise<boolean> | boolean {
		if (this.authService.isLogged() && !this.authService.isAdmin()) {
			return true;
		}

		this.alertService.warning("Désolé. Vous n'avez pas accès à cette page !");
		if(this.authService.isLogged && this.authService.isAdmin)
			this.router.navigate(["/admin/home"], {
				queryParams: { returnUrl: state.url }
			});
		else
			this.router.navigate(["/login"], { queryParams: { returnUrl: state.url } });
		return false;
	}
}
