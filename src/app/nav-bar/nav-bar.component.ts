import { Component, OnInit, AfterViewInit } from '@angular/core';
import { User } from '../models/user.model';
import { AlertService } from '../services/alert.service';
import { AuthenticationService } from "../services/authentication.service";
import { Role } from '../models/role.model';
import { PrivilegeService } from '../services/privilege.service';
import { ArchiveService } from '../services/archive.service';
import { Router } from '@angular/router';
import { StorageService } from '../services/storage.service';
import { Session } from 'protractor';
import * as CONST from '../app-const';
import { Setting } from '../models/setting.model';

declare var $;

@Component({
  selector: "app-nav-bar",
  templateUrl: "./nav-bar.component.html",
  styleUrls: ["./nav-bar.component.scss"]
})
export class NavBarComponent implements OnInit, AfterViewInit {
  user: User;
	hasPrivilige: boolean[] = [];
	private static PRIVILES_SESSION_NAME: string = 'NavBarComponent.privileges';
	isLoading = true;
	isWaiting = false;
	display = 'none';
	since = '';
	password = '';
	sinceIsEmpty = true;

  constructor(
    private authService: AuthenticationService,
		private alertService: AlertService,
		private archiveService: ArchiveService,
		private privilegeService: PrivilegeService,
		private storageService: StorageService,
		private router: Router
  ) {}

  async ngOnInit() {
		this.isLoading = true;

		this.user = this.authService.getUser();

		this.hasPrivilige = JSON.parse(sessionStorage.getItem(NavBarComponent.PRIVILES_SESSION_NAME));
	
		if (!this.hasPrivilige || this.hasPrivilige.length == 0){
			
			this.hasPrivilige = [];
			for (let i = 0; i < 100; i++) {
				this.hasPrivilige[i] = false;
			}

			if(this.authService.isLogged()){
				let privileges = await this.privilegeService.getPrivileges().toPromise();
				privileges.forEach((p) => {
					this.hasPrivilige[p.id] = true;
				});
			}
			
			sessionStorage.setItem(NavBarComponent.PRIVILES_SESSION_NAME, JSON.stringify(this.hasPrivilige));
		}

		this.isLoading = false;

		await this.listOfValidTypeOfFile();
  }

	ngAfterViewInit() {
		this.handle();
	}

	async listOfValidTypeOfFile()
	{
		await this.storageService.getAllTypes().subscribe((data: Setting) => {
			sessionStorage.setItem(
				CONST.VALID_FILE_TYPES,
				data.typeOfFiles
			);
		});
	}

	handle() {
		//$('span ~ ul').hide();
		const that = this;
	 	{
			let list = document.querySelectorAll('header a[routerLink]');
			for (let i = 0; i < list.length; i++) {
				let elt = <HTMLElement>list[i];
				let link = elt.getAttribute('routerLink');
				elt.onclick = function(e){
					e.preventDefault();
					that.closeNavigation();
					that.router.navigate([link]);
				}
			}
		}

		{
			let dropdowarrowTag = `<span class="tg-dropdowarrow"><i class="fa fa-angle-down"></i></span>`;
			let list = document.getElementsByClassName('tg-hasdropdown');
			for (let i = 0; i < list.length; i++) {
				if(!list[i].innerHTML.includes(dropdowarrowTag)){
					list[i].innerHTML = dropdowarrowTag + list[i].innerHTML;
				}
			}
		}

		{
			let list = document.getElementsByClassName('tg-dropdowarrow');
			for (let i = 0; i < list.length; i++) {
				let elt = <HTMLElement>list[i];
				elt.onclick = function () {
					let ul = $(elt).parent().find('ul');
					if (ul.is(':visible'))
						ul.hide();
					else{
						//$('span ~ ul').hide();
						ul.show();
					}
				}
			}
		}

	}


	closeNavigation(){
		let b = document.getElementById('tg-navigation').getAttribute('aria-expanded');
		if (b == 'true') {
			document.getElementById('btnnav').click();
		}
	}

  isAdmin()
  {
		if(!this.user)
			return false;
    let role: Role = this.user.roles.filter(role => role.name.toLocaleUpperCase() === 'ADMIN')[0];
    return role ? true : false; 
  }

  onLogout() {
    this.authService.logout();
		this.alertService.info("Vous avez été déconnecté avec succès");
	}
	

	openModal() {
		this.onCloseHandled();
		this.display = 'block';
		this.since = '';
		this.password = '';
		this.sinceIsEmpty = true;
	}


	openWaiter(){
		this.onCloseHandled()
		this.isWaiting = true;
	}

	onCloseHandled() {
		this.display = 'none';
		this.isWaiting = false;
	}

	onDateFocus(){
		this.sinceIsEmpty = false;
	}

	onDateBlur(){
		this.sinceIsEmpty = !this.since;
	}

	restoreError(msg?){
		if(!msg){
			msg = 'Echec de la restauration car mot de passe incorrect !';
		}
		this.alertService.error(msg);
	}


	restore(){
		this.onCloseHandled();
		this.archiveService.restoreAll(this.password, new Date(this.since).getTime()).toPromise()
		.then( (resp:any) => {
			if (resp.status) {
				this.alertService.success('Vos archives supprimées ont été toutes restaurer !')
			}else{
				this.restoreError();
			}
		})
		.catch( err => {
			this.restoreError(err);
		})
		.finally( () => this.onCloseHandled());
	}
}
