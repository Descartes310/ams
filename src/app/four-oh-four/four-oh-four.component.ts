import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { User } from '../models/user.model';
import { Role } from '../models/role.model';
import { CURRENT_URL_SESSION_VARNAME } from "../app-const";

@Component({
	selector: "app-four-oh-four",
	templateUrl: "./four-oh-four.component.html",
	styleUrls: ["./four-oh-four.component.scss"]
})
export class FourOhFourComponent implements OnInit {
	
	private user: User;
	backUrl: string = '';

	constructor(private authService: AuthenticationService) {
		this.backUrl = sessionStorage.getItem(CURRENT_URL_SESSION_VARNAME);
	}

	ngOnInit() {
		this.user = this.authService.getUser();
	}


	isAdmin() {
		let role: Role = this.user.roles.filter(
			role => role.name.toLocaleUpperCase() === "ADMIN"
		)[0];
		return role ? true : false;
	}
}
