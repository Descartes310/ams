import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { AlertService } from '../services/alert.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {

	constructor(
		private authService: AuthenticationService,
		private alertService: AlertService) { }

  ngOnInit() {
		this.authService.logout();
		this.alertService.info("You have been successfully logged out");
  }

}
