import { Component, OnInit, OnDestroy } from "@angular/core";
import { Http, Response } from "@angular/http";
import { Subject, Observable } from "rxjs";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AlertService } from "../services/alert.service";
import { Router, ActivatedRoute } from "@angular/router";
import { RoleService } from "../services/role.service";
import { switchMap } from "rxjs/operators";
import { PrivilegeService } from "../services/privilege.service";
import { Privilege } from "../models/privilege.model";
import * as CONST from "../app-const";
import { User } from "../models/user.model";
import { UserService } from "../services/user.service";
import { ArchiveService } from "../services/archive.service";
import { StorageService } from "../services/storage.service";
import { Setting } from "../models/setting.model";

@Component({
	selector: "app-file-type",
	templateUrl: "./file-type.component.html",
	styleUrls: ["./file-type.component.scss"]
})
export class FileTypeComponent implements OnInit {
	typeOfFiles = [];
	selectedType: any;
	loading = false;
	isSubmitted = false;
	checkboxs: boolean[] = [];
	private alert: AlertService;

	constructor(
		private route: ActivatedRoute,
		private router: Router,
    private alertService: AlertService,
    private storageService: StorageService
	) {
		this.alert = alertService;
	}

	async ngOnInit() {
		this.typeOfFiles = ["pdf", "png", "jpg", "jpeg", "gif"];
		await this.getTypes();
	}
	//This function is used to get all privileges
	async getTypes() {
		await this.storageService.getAllTypes().subscribe((data: Setting) => {
			this.selectedType = data.typeOfFiles.split(",");
			this.selectedType.forEach(type => {
				this.checkboxs[type] = true;
			});
		});
	}

	async onSubmit() {
		this.isSubmitted = true;
		if (
			this.selectedType.length < 1
		) {
			this.alertService.error(
				"Au moins un type de fichier est requis !"
			);
			this.loading = false;
			return;
		}
		this.loading = true;

		await this.storageService
			.editTypes(this.selectedType)
			.then(data => {
				this.alertService.success(
					"Liste des types de fichiers valides mise a jour !"
				);
				this.loading = false;
			})
			.catch((err: HttpErrorResponse) => {
				this.alertService.error("" + err);
				this.loading = false;
			});
	}

	setChecked(name: string) {
		if (this.checkboxs[name] == true) {
			this.selectedType[this.selectedType.length] = name;
		}
		else {
			const index = this.selectedType.indexOf(name, 0);
			if (index > -1) {
				this.selectedType.splice(index, 1);
			}
		}
	}
}
