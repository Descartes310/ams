import { Component, OnInit, OnDestroy } from "@angular/core";
import { Http, Response } from "@angular/http";
import { Subject } from "rxjs";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { MetadataService } from "../services/metadata.service";
import { switchMap } from "rxjs/operators";
import * as CONST from "../app-const";
import { Metadata } from "../models/metadata.model";
import { AlertService } from "../services/alert.service";

@Component({
	selector: "app-edit-metadata",
	templateUrl: "./edit-metadata.component.html",
	styleUrls: ["./edit-metadata.component.scss"]
})
export class EditMetadataComponent implements OnInit {
	metadata: Metadata;
	addMetaForm: FormGroup;
	loading = false;
	isSubmitted = false;
	name: string;
	label: string;
	metadataId: string;
	returnUrl: string;
	private alert: AlertService;

	constructor(
		private formBuilder: FormBuilder,
		private route: ActivatedRoute,
		private router: Router,
		private metadataService: MetadataService,
		private alertService: AlertService
	) {
		this.alert = alertService;
	}

	get getAddMetaForm() {
		return this.addMetaForm.controls;
	}

	async ngOnInit() {
		this.addMetaForm = this.formBuilder.group({
			name: [],
			type: ["", Validators.compose([Validators.required])],
			label: [
				"",
				Validators.compose([
					Validators.required,
					Validators.minLength(3),
					Validators.maxLength(20)
				])
			]
		});

		this.metadataId = this.route.snapshot.paramMap.get("id");

		await this.getMetadata();
	}

	async getMetadata() {
		await this.metadataService
			.getMetadata(this.metadataId)
			.toPromise()
			.then((data: Metadata) => {
				this.metadata = data;
				this.getAddMetaForm.name.setValue(this.metadata.name);
				this.getAddMetaForm.label.setValue(this.metadata.label);
				this.getAddMetaForm.type.setValue(this.metadata.type);
			})
			.catch((err: HttpErrorResponse) => {
				this.alertService.error("" + err);
				this.router.navigate(["/admin/metadatas"]);
			});
	}

	//This function is used to update a existing metadata after form submission
	async editMetadata() {
		this.isSubmitted = true;
		if (this.addMetaForm.invalid) {
			this.loading = false;
			return;
		}
		this.loading = true;
		let name = this.getAddMetaForm.label.value.replace(/[^a-zA-Z0-9]/g, '_');
		this.getAddMetaForm.name.setValue(name);
		await this.metadataService
			.editMetadata(
				this.getAddMetaForm.name.value,
				this.getAddMetaForm.label.value,
				this.getAddMetaForm.type.value,
				this.metadata.id
			)
			.then(data => {
				this.getAddMetaForm.name.setValue(this.getAddMetaForm.name.value);
				this.getAddMetaForm.label.setValue(this.getAddMetaForm.label.value);
				this.getAddMetaForm.type.setValue(this.getAddMetaForm.type.value);
				this.alertService.success(
					"Méta donnée éditée avec succès !"
				);
				this.loading = false;
				this.router.navigate(["/admin/metadatas"]);
			})
			.catch((err: HttpErrorResponse) => {
				this.alertService.error("" + err);
				this.loading = false;
			});
	}
}
