import { Component, OnInit } from "@angular/core";
import { AuthenticationService } from "../services/authentication.service";
import { AlertService } from "../services/alert.service";

import { Router, ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { UserService } from "../services/user.service";
import { HttpErrorResponse } from "@angular/common/http";

@Component({
	selector: "app-forgot-password",
	templateUrl: "./forgot-password.component.html",
	styleUrls: ["./forgot-password.component.scss"]
})
export class ForgotPasswordComponent implements OnInit {
	emailForm: FormGroup;
	loading = false;
	submitted = false;
  returnUrl: string;
  status = false;

	constructor(
		private formBuilder: FormBuilder,
		private router: Router,
		private authenticationService: AuthenticationService,
		private alertService: AlertService
	) {}

	ngOnInit() {
		this.emailForm = this.formBuilder.group({
			email: ["", Validators.required]
		});

		if (this.authenticationService.isLogged()) {
			if (this.authenticationService.isAdmin())
				this.router.navigate(["/admin"]);
			else this.router.navigate(["/home"]);
		}
	}

	// convenience getter for easy access to form fields
	get f() {
		return this.emailForm.controls;
	}

	async onSubmit() {
    this.submitted = true;

		// stop here if form is invalid
		if (this.emailForm.invalid) {
			return;
		}

		this.loading = true;
		this.authenticationService
			.forgotPassword(this.f.email.value)
			.then(data => {
				this.goToLogin();
				this.alertService.success(
					"Les nouveaux paramètres de connexion ont étés envoyés à " +
					this.f.email.value +
					" !"
				);
			})
			.catch((err: HttpErrorResponse) => {
				this.alertService.error("" + err);
			})
			.finally( () => {
				this.loading = false;
			});
	}


	goToLogin(){
		this.router.navigate(['/login']);
	}
}
