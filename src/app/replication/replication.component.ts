import { Component, OnInit } from "@angular/core";
import { ArchiveService } from "../services/archive.service";
import { LoadResourceService } from "../services/load-resource.service";
import { HttpErrorResponse } from "@angular/common/http";
import { AuthenticationService } from "../services/authentication.service";
import { Utils } from "../app-utils";
import * as CONST from "../app-const";
import { StorageService } from "../services/storage.service";
import { AlertService } from "../services/alert.service";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";

@Component({
	selector: "app-replication",
	templateUrl: "./replication.component.html",
	styleUrls: ["./replication.component.scss"]
})
export class ReplicationComponent implements OnInit {
	isLoading = false;
	replicationForm: FormGroup;
	showSpinner: boolean = false;
	isSubmitted = false;
	display = false;
	filter = { name: "", date: "" };
	selectedItems: Storage[] = [];
	dropdownList = [];
	data = [];
	dropdownSettings = {};

	private param: string[] = [];

	constructor(
		private formBuilder: FormBuilder,
		private storageService: StorageService,
		private alertService: AlertService,
	) {}

	get getReplicationForm() {
		return this.replicationForm.controls;
	}

	async ngOnInit() {

		this.replicationForm = this.formBuilder.group({
			login: [
				"", 
				Validators.compose([
					Validators.required
				])],
			password: [
				"", 
				Validators.compose([
					Validators.required
			])]
		});

		this.data = await this.storageService.getStorages().toPromise();
		this.dropdownList = this.data.filter(storage => storage.status && !storage.isActive);
		this.dropdownSettings = {
			singleSelection: true,
			idField: "id",
			textField: "name",
			selectAllText: "Sélectionner tou",
			unSelectAllText: "Désélectionner tou",
			allowSearchFilter: false
		};
		if(sessionStorage.getItem(CONST.BACKUP_PROCESSING))
		{
			this.isLoading = true;
		}
	}

	openConfimModal() {
		this.display = true;
	}

	onCloseHandled() {
		this.display = this.showSpinner = false;
	}

	advice() {
		if (this.selectedItems.length == 0) {
			this.alertService.error(
				"Veuillez sélectionner un serveur avant de continuer !"
			);
			return;
		}
		this.display = true;
		this.isLoading = false;
	}

	async replicate() {
		this.isSubmitted = true;
		if (this.replicationForm.invalid) {
			return;
		}
		this.isLoading = true;
		this.display = false;
		this.showSpinner = false;
		this.alertService.success("Backup demarré avec succès");	
		this.alertService.info("Vous serez notifié à la fin de l'operation !");	
		sessionStorage.setItem(CONST.BACKUP_PROCESSING, 'true');
		await this.storageService
			.replicate(
				this.selectedItems[0].id,
				this.getReplicationForm.login.value,
				this.getReplicationForm.password.value
			)
			.then((data) => {
				this.alertService.success("Backup effectué avec succès");
			})
			.catch((err: HttpErrorResponse) => {
				this.alertService.error(""+err);
			});
		sessionStorage.removeItem(CONST.BACKUP_PROCESSING);
		this.isLoading = false;
	}

	//these function are used to set role and servers list
	onItemSelect(item: any) {
		this.selectedItems.push(item);
	}

	onItemDeSelect(item: any) {
		let metadata = this.selectedItems.filter(x => x.id === item.id)[0];
		var index = this.selectedItems.indexOf(metadata);
		if (index > -1) {
			this.selectedItems.splice(index, 1);
		}
	}

	onSelectAll(items: any) {
		this.selectedItems = items;
	}
}

