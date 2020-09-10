import { Component, OnInit, OnDestroy } from "@angular/core";
import { Http, Response } from "@angular/http";
import { Subject } from "rxjs";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { StorageService } from "../services/storage.service";
import { switchMap } from "rxjs/operators";
import * as CONST from "../app-const";
import { Storage } from "../models/storage.model";
import { AlertService } from "../services/alert.service";

@Component({
	selector: "app-edit-storage",
	templateUrl: "./edit-storage.component.html",
	styleUrls: ["./edit-storage.component.scss"]
})
export class EditStorageComponent implements OnInit {
	public storage: Storage;
	addStorageForm: FormGroup;
	loading = false;
	isSubmitted = false;
	name: string;
	label: string;
	storageId: string;
	returnUrl: string;
	private alert: AlertService;

	constructor(
		private formBuilder: FormBuilder,
		private route: ActivatedRoute,
		private router: Router,
		private storageService: StorageService,
		private alertService: AlertService
	) {
		this.alert = alertService;
	}

	get getAddStorageForm() {
		return this.addStorageForm.controls;
	}

	async ngOnInit() {
		this.addStorageForm = this.formBuilder.group({
			name: [
				"",
				Validators.compose([
					Validators.required,
					Validators.minLength(3),
					Validators.maxLength(20)
				])
			],
			address: [
				"",
				Validators.compose([
					Validators.required,
					Validators.pattern(
						"^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]).){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$"
					)
				])
			],
			path: [
				"",
				Validators.compose([
					Validators.required,
					Validators.pattern("^(/[a-zA-Z0-9_]+)+/?$")
				])
			],
			type: [""]
		});

		this.storageId = this.route.snapshot.paramMap.get("id");

		await this.getStorage();
	}

	async getStorage() {
		await this.storageService
			.getStorage(this.storageId)
			.toPromise()
			.then((data: Storage) => {
				if(data.isActive)
				this.router.navigate(["/admin/storages"]);
				this.storage = data;
				this.getAddStorageForm.name.setValue(this.storage.name);
				this.getAddStorageForm.path.setValue(this.storage.path);
				this.getAddStorageForm.address.setValue(this.storage.address);
				this.getAddStorageForm.type.setValue("server");
			})
			.catch((err: HttpErrorResponse) => {
				this.alertService.error("" + err);
				this.router.navigate(["/admin/storages"]);
			});
	}

	//This function is used to update a existing metadata after form submission
	async editStorage() {
		this.isSubmitted = true;
		if (this.addStorageForm.invalid) {
			this.loading = false;
			return;
		}
		this.loading = true;
		await this.storageService
			.editStorage(
				this.getAddStorageForm.name.value,
				this.getAddStorageForm.address.value,
				this.getAddStorageForm.path.value,
				this.getAddStorageForm.type.value,
				this.storage.status,
				this.storage.isActive,
				this.storage.id
			)
			.then(data => {
				this.alertService.success(
					"Nouveau stockage ajouté avec succès !"
				);
				this.loading = false;
				this.router.navigate(["/admin/storages"]);
			})
			.catch((err: HttpErrorResponse) => {
				this.alertService.error("" + err);
				this.loading = false;
			});
	}
}