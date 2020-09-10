import { Injectable } from "@angular/core";
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from "@angular/router";
import { Observable } from "rxjs";
import { AuthenticationService } from "../services/authentication.service";
import { AlertService } from "../services/alert.service";
import * as CONST from "../app-const";

@Injectable({
	providedIn: "root"
})
export class PrivilegeGuard implements CanActivate {
	
	constructor(
		private authService: AuthenticationService,
		private alertService: AlertService,
		private router: Router
	) {}

	canActivate(
		next: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	): Observable<boolean> | Promise<boolean> | boolean {
		
		let privilegeID = next.data["privilegeID"] as number;
		sessionStorage.setItem(CONST.CURRENT_URL_SESSION_VARNAME, state.url);
		return this.authService.hasPrivilege(privilegeID, () => {
			if (privilegeID === 1)
				this.router.navigate(['/logout']);
			this.alertService.warning("Désolé. Vous n'avez pas le privilège pour effectuer cette action !");
		});
	}
}
