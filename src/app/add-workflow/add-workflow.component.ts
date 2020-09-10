import { Component, OnInit } from "@angular/core";
import { HttpErrorResponse } from "@angular/common/http";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { WorkflowService } from "../services/workflow.service";
import { StorageService } from "../services/storage.service";
import { CategoryService } from "../services/category.service";
import { Storage } from "../models/storage.model";
import { AlertService } from "../services/alert.service";
import { GroupService } from "../services/group.service";
import { Group } from "../models/group.model";
import { formatDate } from "@angular/common";

@Component({
	selector: "app-add-workflow",
	templateUrl: "./add-workflow.component.html",
	styleUrls: ["./add-workflow.component.scss"]
})
export class AddWorkflowComponent implements OnInit {
	/* variables declaration */
	addForm: FormGroup;
  idToDelete: number;
  loginError = false;
  passwordError = false;
	showDeleteUserModal = false;
	loading = false;
	storages: Storage[] = [];
	groups: Group[] = [];
	dropdownListServer = [];
	dropdownSettingsServer = {};
	selectedItemsServer: Storage[] = [];
  isSubmitted = false;
  isReplication = false;
	params: string;
	today: string;
	hour: string;

	constructor(
		private formBuilder: FormBuilder,
		private router: Router,
		private storageService: StorageService,
		private workflowService: WorkflowService,
		private alertService: AlertService
	) {}

	ngOnInit() {
		this.addForm = this.formBuilder.group({
			name: [
				"",
				Validators.compose([Validators.required, Validators.minLength(3)])
			],
			date: ["", Validators.compose([Validators.required])],
			time: ["", Validators.compose([Validators.required])],
			login: ["", Validators.compose([Validators.minLength(0)])],
			password: ["", Validators.compose([Validators.minLength(0)])],
			servers: [""]
		});

		this.today = formatDate(new Date(), "yyyy-MM-dd", "en-US");
		this.hour = formatDate(new Date(), "HH:mm", "en-US");
		this.getServers();

		this.dropdownSettingsServer = {
			singleSelection: true,
			idField: "id",
			textField: "name",
			selectAllText: "Sélectionner tout",
			unSelectAllText: "Désélectionner tout",
			allowSearchFilter: true
		};
	}

	get getAddForm() {
		return this.addForm.controls;
	}

	//This function is used to get all Storage
	async getServers() {
		await this.storageService.getStorages().subscribe((data: Storage[]) => {
			this.dropdownListServer = data; //this line initialize the select list for Storage
		});
	}

	//This function is used to add a new group after form submission
	async onSubmit() {
		this.loginError = false;
		this.passwordError = false;
		if (this.addForm.invalid) {
		this.loading = false;
		if (!this.getAddForm.login.value) this.loginError = true;
			if (!this.getAddForm.password.value) this.passwordError = true;
				return;
		}
		if (this.getAddForm.date.value <= this.today) {
			if (this.getAddForm.time.value <= this.hour){
				this.alertService.error("L'instant d'exécution specifié est déjà passé !");
				return;
			}
		}
    	this.loading = true;
		if(this.selectedItemsServer.length > 0)
		{
			let tmpParams = {};
			tmpParams["login"] = this.getAddForm.login.value;
			tmpParams["password"] = this.getAddForm.password.value;
			tmpParams["server"] = this.selectedItemsServer[0].id;
			this.params = JSON.stringify(tmpParams);
		}
		else{
			this.alertService.error(
				"Vous devez sélectionner le serveur de destination !"
			);
			this.loading = false;
			return;
		}
		this.workflowService.addPlannification(
			this.getAddForm.name.value,
			this.getAddForm.date.value,
			this.getAddForm.time.value,
      		this.params
		)
		.then((data) => {
				this.alertService.success(
					"Nouvelle plannification ajoutée avec succès !"
				);
				this.loading = false;
				this.router.navigate(["/admin/workflows"]);
		})
		.catch((err: HttpErrorResponse) => {
			this.alertService.error(
				""+err
			);
			this.loading = false;
		});
	}

	//these function are used to set role and ampliation list
	onItemSelectS(item: any) {
		this.selectedItemsServer.push(item);
	}

	onItemDeSelectS(item: any) {
		let role = this.selectedItemsServer.filter(x => x.id === item.id)[0];
		var index = this.selectedItemsServer.indexOf(role);
		if (index > -1) {
			this.selectedItemsServer.splice(index, 1);
		}
	}

	onSelectAllS(items: any) {
		this.selectedItemsServer = items;
	}
}

