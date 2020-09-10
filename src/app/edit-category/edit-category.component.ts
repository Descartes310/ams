import { Component, OnInit } from "@angular/core";
import { HttpErrorResponse } from "@angular/common/http";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AlertService } from "../services/alert.service";
import { Router, ActivatedRoute } from "@angular/router";
import { Category } from "../models/category.model";
import { Metadata } from "../models/metadata.model";
import { MetadataService } from "../services/metadata.service";
import { CategoryService } from "../services/category.service";
import { Group } from "../models/group.model";
import { GroupService } from "../services/group.service";

@Component({
	selector: "app-edit-category",
	templateUrl: "./edit-category.component.html",
	styleUrls: ["./edit-category.component.scss"]
})
export class EditCategoryComponent implements OnInit {
	addCategoryForm: FormGroup;
	metadatas: Metadata[] = [];
	name: string;
	category: Category;
	description: string;
	categoryId: string;
	loading = false;
	selectedItemsMetadatas: Metadata[] = [];
	dropdownListMetadatas = [];
	dropdownSettingsMetadatas = {};
	selectedItemsGroupes: Group[] = [];
	dropdownListGroupes = [];
	dropdownSettingsGroupes = {};
	isSubmitted = false;

	constructor(
		private formBuilder: FormBuilder,
		private route: ActivatedRoute,
		private router: Router,
		private alertService: AlertService,
		private metadataService: MetadataService,
		private categoryService: CategoryService,
		private groupService: GroupService
	) { }

	get getAddCategoryForm() {
		return this.addCategoryForm.controls;
	}

	async ngOnInit() {
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
			],
			metadatas: [],
			groups: []
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

		this.categoryId = this.route.snapshot.paramMap.get("id");

		await this.getCategory();
    
	}

	async getCategory()
	{
		await this.categoryService.getCategory(this.categoryId)
		.toPromise()
		.then((data: Category) => {
			this.category = data;
			this.getAddCategoryForm.name.setValue(this.category.name);
			this.getAddCategoryForm.description.setValue(this.category.description);
			this.selectedItemsMetadatas = this.category.metadatas;
			//this.selectedItemsGroupes = this.category.groups;
			this.groupService.categoryGroups(this.category.id).subscribe(data => this.selectedItemsGroupes = data);
		})
		.catch((err: HttpErrorResponse) => {
			this.alertService.error(""+err);
			this.router.navigate(["/admin/categories"]);
		})
	}
	//This function is used to get metadatas
	async getMetadatas() {
		await this.metadataService.getMetadatas().subscribe((data: Metadata[]) => {
			this.dropdownListMetadatas = data;
		});
	}
	//This function is used to get all groups
	async getGroupes() {
		await this.groupService.getGroups().subscribe((data: Group[]) => {
			this.dropdownListGroupes = data; //this line initialize the select list for metadatas
		});
	}

	//This function is used to edit an existing group after form submission
	async onSubmit() {
		this.isSubmitted = true;
		this.loading = true;

		if (this.addCategoryForm.invalid) {
			this.loading = false;
			return;
    	}
		
		await this.categoryService.editCategory(
			this.getAddCategoryForm.name.value,
			this.getAddCategoryForm.name.value.replace(/[^a-zA-Z0-9]/g, '_'),
			this.getAddCategoryForm.description.value,
			this.category.isBlocked,
			this.selectedItemsMetadatas,
			this.selectedItemsGroupes,
			this.category.id
		)
		.then((data) => {
			this.alertService.success(
				"Catégorie éditée avec succès !"
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
		console.log(this.selectedItemsGroupes)
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
