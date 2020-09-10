import { Component, OnInit, OnDestroy } from "@angular/core";
import { Http, Response } from "@angular/http";
import { Subject } from "rxjs";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { GroupService } from "../services/group.service";
import { UserService } from "../services/user.service";
import { RoleService } from "../services/role.service";
import { Group } from "../models/group.model";
import { User } from "../models/user.model";
import { Role } from "../models/role.model";
import * as CONST from "../app-const";
import { AlertService } from "../services/alert.service";
import { CategoryService } from "../services/category.service";
import { MetadataService } from "../services/metadata.service";
import { Metadata } from "../models/metadata.model";

@Component({
	selector: "app-add-category",
	templateUrl: "./add-category.component.html",
	styleUrls: ["./add-category.component.scss"]
})
export class AddCategoryComponent implements OnInit {
	/* variables declaration */
	addCategoryForm: FormGroup;
	loading = false;
	metadatas: Metadata[] = [];
	selectedItemsMetadatas: Metadata[] = [];
	dropdownListMetadatas = [];
	dropdownSettingsMetadatas = {};
	selectedItemsGroupes: Group[] = [];
	dropdownListGroupes = [];
	dropdownSettingsGroupes = {};
	isSubmitted = false;
	returnUrl: string;
	private alert: AlertService;

	constructor(
		private formBuilder: FormBuilder,
		private route: ActivatedRoute,
		private router: Router,
		private categoryService: CategoryService,
		private metadataService: MetadataService,
		private groupService: GroupService,
		private alertService: AlertService
	) {
		this.alert = alertService;
	}

	ngOnInit() {
		this.addCategoryForm = this.formBuilder.group({
			name: [
				"",
				Validators.compose([
					Validators.required,
					Validators.minLength(3),
					Validators.maxLength(20)
				])
			],
			description: [
				"",
				Validators.compose([
					Validators.required,
					Validators.minLength(10),
					Validators.maxLength(255)
				])
			]
		});
		this.getMetadatas();
		this.getGroupes();
		this.dropdownSettingsGroupes = {
			singleSelection: false,
			idField: "id",
			textField: "name",
			selectAllText: "Sélectionner tout",
			unSelectAllText: "Désélectionner tout",
			allowSearchFilter: true
		};
		this.dropdownSettingsMetadatas = {
			singleSelection: false,
			idField: "id",
			textField: "name",
			selectAllText: "Sélectionner tout",
			unSelectAllText: "Désélectionner tout",
			allowSearchFilter: true
		};
	}

	get getAddCategoryForm() {
		return this.addCategoryForm.controls;
	}

	//This function is used to get all metadatas
	async getMetadatas() {
		await this.metadataService.getMetadatas().subscribe((data: Metadata[]) => {
			this.dropdownListMetadatas = data; //this line initialize the select list for metadatas
		});
	}
	//This function is used to get all groups
	async getGroupes() {
		await this.groupService.getGroups().subscribe((data: Group[]) => {
			this.dropdownListGroupes = data; //this line initialize the select list for metadatas
		});
	}

	//This function is used to add a new category after form submission
	async onSubmit() {
		//it check if fields are filled correctly
		this.isSubmitted = true;
		if (this.addCategoryForm.invalid || this.selectedItemsGroupes.length == 0) {
			this.loading = false;
			return;
		}
		this.loading = true;
		/* ******* */
		await this.categoryService.addCategory(
			this.getAddCategoryForm.name.value,
			this.getAddCategoryForm.name.value.replace(/[^a-zA-Z0-9]/g, '_'),
			this.getAddCategoryForm.description.value,
			this.selectedItemsMetadatas,
			this.selectedItemsGroupes
		)
		.then((data) => {
			this.alert.showNotification(
				"success",
				"Nouvelle catégorie ajoutée avec succès !"
			);
			this.loading = false;
			//this.router.navigate(["/admin/categories"]);
		})
		.catch((err: HttpErrorResponse) => {
			this.alertService.error(
				""+err
			);
			this.loading = false;
		});
	}

	//these function are used to set role and metadata list
	onItemSelectMetadatas(item: any) {
		this.selectedItemsMetadatas.push(item);
	}

	onItemDeSelectMetadatas(item: any) {
		let metadata = this.selectedItemsMetadatas.filter(x => x.id === item.id)[0];
		var index = this.selectedItemsMetadatas.indexOf(metadata);
		if (index > -1) {
			this.selectedItemsMetadatas.splice(index, 1);
		}
	}

	onSelectAllMetadatas(items: any) {
		this.selectedItemsMetadatas = items;
	}

	onItemSelectGroupes(item: any) {
		this.selectedItemsGroupes.push(item);
	}

	onItemDeSelectGroupes(item: any) {
		let group = this.selectedItemsGroupes.filter(x => x.id === item.id)[0];
		var index = this.selectedItemsGroupes.indexOf(group);
		if (index > -1) {
			this.selectedItemsGroupes.splice(index, 1);
		}
	}

	onSelectAllGroupes(items: any) {
		this.selectedItemsGroupes = items;
	}
}
