import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthenticationService } from './services/authentication.service';
import { StorageService } from './services/storage.service';
import { ArchiveService } from './services/archive.service';
import { LoadResourceService } from './services/load-resource.service';
import { Utils } from "./app-utils";
import { Archive } from './models/archive.model';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';

@Component({
	selector: "app-root",
	templateUrl: "./app.component.html",
	styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit, OnDestroy {
	groups: any[] = [];
	servers: any;
	display = false;
	percentDone: number = 0;
	kbLoaded: string = "";
	kbNeeded: string = "";
	serverId: number;
	serverLogin: string;
	serverPassword: string;
	private param: string[] = [];
	showNavBarAndFooter = false;
	private sub: Subscription;

	constructor(
		private authService: AuthenticationService,
		private loadResourceService: LoadResourceService,
		private storageService: StorageService,
		private archiveService: ArchiveService,
		private router: Router
	) {}


	ngOnInit() {
		this.sub = this.router.events
			.subscribe((event) => {
				if (event instanceof NavigationEnd) {
					this.updateNavBarAndFooter();
				}
			});
	}

	updateNavBarAndFooter(){
		let bool = document.URL
			&& !document.URL.includes('login')
			&& !document.URL.includes('forgot-password')
			&& this.authService.isLogged();

		if (this.showNavBarAndFooter != bool)
			this.showNavBarAndFooter = bool;
	}
	
	ngOnDestroy() {
		this.sub.unsubscribe();
	}


	export() {
		this.param = [];
		let kbNeeded = 0;
		this.kbNeeded = Utils.getReadableFileSizeString(kbNeeded);
		let list = document.getElementsByClassName("selection-checkbox");

		for (let i = 0, t = list.length; i < t; i++) {
			let elt = <HTMLInputElement>list[i];
			if (elt.checked) {
				let eltId = parseInt(elt.name);
				this.groups.forEach(async g => {
					if (g.id == eltId) {
						let archives = await this.archiveService
							.allOfGroup(g.id)
							.toPromise();
						archives.forEach((a: Archive) => {
							if (this.param.indexOf(a.path) < 0) {
								this.param.push(a.path);
								kbNeeded += parseInt(a.size);
								this.kbNeeded = Utils.getReadableFileSizeString(2 * kbNeeded);
							}
						});
					}
				});
			}
		}
		this.kbNeeded = Utils.getReadableFileSizeString(kbNeeded);
		this.exportFiles();
	}

	exportFiles() {
		this.loadResourceService
			.exportToZip(this.param)
			.subscribe((event: HttpEvent<any>) => {
				console.log(event);
				switch (event.type) {
					case HttpEventType.Sent:
						break;
					case HttpEventType.ResponseHeader:
						break;
					case HttpEventType.UploadProgress:
						break;
					case HttpEventType.DownloadProgress:
						this.kbLoaded = Utils.getReadableFileSizeString(event.loaded);
						if (event.total) {
							this.percentDone = Math.round((100 * event.loaded) / event.total);
							this.kbNeeded = Utils.getReadableFileSizeString(event.total);
						} else {
							this.percentDone = 99;
							this.kbNeeded = "";
						}
						break;
					case HttpEventType.Response:
						this.downloadBlob(event.body);
				}
			});
	}

	downloadBlob(blob: Blob) {
		const d = new Date();
		const user = this.authService.getUser();
		let zipFileName =
			"export_of_" +
			user.login +
			"_D_" +
			d.getDate() +
			"-" +
			(d.getMonth() + 1) +
			"-" +
			d.getFullYear() +
			"_T_" +
			d.getTime();
		zipFileName += ".zip";
		Utils.download(blob, zipFileName);
	}

	async replicate() {
		await this.storageService
			.replicate(
				this.serverId,
				this.serverLogin,
				this.serverPassword
			);
	}

	onClose(event: Event) {
		this.authService.logout();
	}
}
