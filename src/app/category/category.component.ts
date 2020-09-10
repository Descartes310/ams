import { Component, OnInit, OnDestroy } from "@angular/core";
import { Http, Response } from "@angular/http";
import { Subject } from "rxjs";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { AlertService } from "../services/alert.service";
import { Router, ActivatedRoute } from "@angular/router";
import { CategoryService } from "../services/category.service";
import { NotifierService } from "angular-notifier";
import * as CONST from "../app-const";
import { Category } from "../models/category.model";
import { GroupService } from "../services/group.service";

@Component({
	selector: "category",
	templateUrl: "./category.component.html",
	styleUrls: ["./category.component.scss"]
})
export class CategoryComponent implements OnInit {
	allCategories: Category[] = [];
	data: Category[] = [];
	category: Category;
	idToDelete: number;
	returnUrl: string;
	showDeleteCategoryModal = false;
	showCategoryModal = false;
	loading = false;
	blockLoading = false;
	mainLoading = true;
	private alert: AlertService;

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private alertService: AlertService,
		private groupService: GroupService,
		private categoryService: CategoryService
	) {
		this.alert = alertService;
	}

	ngOnInit() {
		this.getCategories();
	}

	//This function is used to get categories
	async getCategories() {
		await this.categoryService
			.getCategoriesAdmin()
			.toPromise()
			.then((data: Category[]) => {
				this.data = data;
				this.data.forEach(cat => {
					this.groupService.categoryGroups(cat.id).subscribe(data => this.data.find(x => x.id == cat.id).groups = data);
				});
				this.allCategories = data;
				this.mainLoading = false;
			})
			.catch((err: HttpErrorResponse) => {
				this.alert.error("" + err);
				this.mainLoading = false;
			});
	}

	//This function is used by dataTable to filter elements
	search(term: string) {
		console.log(this.data);
		if (!term) {
			this.data = this.allCategories;
		} else {
			this.data = this.allCategories.filter(x =>
				x.name
					.trim()
					.toLowerCase()
					.includes(term.trim().toLowerCase())
			);
		}
	}

	editCategory(categoryId: number) {
		this.router.navigate(["/admin/categories", categoryId]);
	}

	//This function is used to set category id before deleting
	async blockCategory(categoryId: number, status: boolean) {
		this.blockLoading = true;
		await this.categoryService.blockCategory(
			categoryId,
			status
		)
		.then((data) => {
			if (status) {
				this.alertService.success(
					"Catégorie bloquée avec succès !"
				);
				this.data.filter(x => x.id === categoryId)[0].isBlocked = true;
			} else {
				this.alertService.success(
					"Catégorie debloquée avec succès !"
				);
				this.data.filter(x => x.id === categoryId)[0].isBlocked = false;
			}
			this.blockLoading = false;
		})
		.catch((err: HttpErrorResponse) => {
			this.alertService.error(
				""+err
			);
			this.blockLoading = false;
		});
	}

	//This function return all details about the selected log
	details(id: number) {
		this.category = this.data.filter(x => x.id === id)[0];
		this.showCategoryModal = true;
	}
}