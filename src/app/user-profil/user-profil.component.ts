import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharingService } from '../services/sharing.service';
import { UserService } from '../services/user.service';
import { AuthenticationService } from '../services/authentication.service';
import { User } from '../models/user.model';
import { AlertService } from '../services/alert.service';
import { HttpClient } from '@angular/common/http';
import * as URL from '../app-url';

@Component({
  selector: 'app-user-profil',
  templateUrl: './user-profil.component.html',
  styleUrls: ['./user-profil.component.scss']
})
export class UserProfilComponent implements OnInit {

  user: User;
  model: any;
	isLoading = false;
	formSubmitted = false;

	//for password modal
	confirmation = '';

	//for privilege
	canEditProfile = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private alertService: AlertService,
    private sharingService: SharingService,
    private userService: UserService,
    private authService: AuthenticationService
  ) { }

  ngOnInit() {
		this.authService.hasPrivilege(3).then(bool => {
			this.canEditProfile = bool;
		});

    this.user = this.authService.getUser();
    this.model = new User();

    this.model.firstName = this.user.firstName;
    this.model.lastName = this.user.lastName;
    this.model.login = this.user.login;
    this.model.email = this.user.email;
    this.model.grade = this.user.grade;
    this.model.telephone = this.user.telephone;

    this.model.avatar = this.user.avatar;

    this.model.oldPassword = '';
		this.model.password = '';

  }

  goToGroup(group) {
    this.sharingService.setData(group);
    this.router.navigate(['/group']);
  }


  onModalButtonPressed(){
		this.isLoading = true;
		this.formSubmitted = true;
    this.userService.update(this.model).toPromise()
			.then( (data:User) => {
				this.user = data;
				this.authService.setUser(data);
				this.alertService.success("Changement éffectué avec succès !");
			})
			.catch((err) => {
				this.alertService.error("Echec de modification de compte: "+err);
			})
			.finally( () => {
				this.isLoading = false;
				this.formSubmitted = false;
			});
  }


  onPasswordModalButtonPressed() {
		this.isLoading = true;
		this.formSubmitted = true;
    this.userService.changePassword(this.model).toPromise()
    .then( () => this.alertService.success("Le mot de passe à été changé avec succès !"))
    .catch((err) => this.alertService.error("Le mot de passe n'a pas pu être changé: " + err))
    .finally(() => {
			this.isLoading = false;
			this.formSubmitted = false;
    });
  }



  onFileUpload(event) {
    const file = event.target.files[0];
    console.log(file);
    if (!file.name.match(/.(jpg|jpeg|png|gif)$/i))
      return this.alertService.error("Ce fichier n'est pas une image");
		const formData = new FormData();
		formData.append('file', file);

		this.http.post<any>(URL.CHANGE_AVATAR, formData)
			.toPromise()
			.then((data) => {
				this.user.avatar = data.avatar;
				this.alertService.success("Avatar changé avec succès !");
			})
			.catch(() => this.alertService.error("L'avatar n'a pas pu être changé !"));
  }
}
