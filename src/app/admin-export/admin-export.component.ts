import { Component, OnInit, ViewChild } from "@angular/core";
import { Group } from "../models/group.model";
import { GroupService } from "../services/group.service";
import { ArchiveService } from "../services/archive.service";
import { Archive } from "../models/archive.model";
import { LoadResourceService } from "../services/load-resource.service";
import { HttpEventType, HttpEvent } from "@angular/common/http";
import { AuthenticationService } from "../services/authentication.service";
import { Utils } from "../app-utils";
import { CategoryService } from "../services/category.service";
import { Category } from "../models/category.model";

@Component({
	selector: "app-admin-export",
	templateUrl: "./admin-export.component.html",
	styleUrls: ["./admin-export.component.scss"]
})
export class AdminExportComponent implements OnInit {
	data: any[] = [];
	allData: any[] = [];
	public groups: Group[] = [];
	public categories: Category[] = [];
	isLoading: boolean = true;
	servers: any;
	showSpinner: boolean = false;
	display = false;
	percentDone: number = 0;
	selectedItems: any[] = [];
	dropdownList = [];
	dropdownSettings = {};
	isSelected = false;
	kbLoaded: string = "";
	kbNeeded: string = "";
	filter = { name: "", date: "" };

	private param: string[] = [];

	//checkbox
	@ViewChild("mf") table;
	allChecked = false;
	checkNum: number = 0;

	//datatable
	numberRowsOnPage = 5;
	dtOptions: any;
	dataTable: any;

	constructor(
		private authService: AuthenticationService,
		private loadResourceService: LoadResourceService,
		private groupService: GroupService,
		private categoryService: CategoryService,
		private archiveService: ArchiveService
	) {}

	async ngOnInit() {
		this.dropdownSettings = {
			singleSelection: true,
			idField: "id",
			textField: "name",
			selectAllText: "Sélectionner tout",
			unSelectAllText: "Désélectionner tout",
			allowSearchFilter: false
		};
		this.dropdownList = [
			{ id: 1, name: "Exporter par categories" },
			{ id: 2, name: "Exporter par groupes" }
		];

		this.dtOptions = {
			dom: "Bfrtip",
			buttons: ["copy", "csv", "excel", "pdf", "print"]
		};

		await this.getCategories();
		await this.getGroups();
	}

	async getGroups() {
		this.groups = await this.groupService.getGroups().toPromise();
	}

	async getCategories() {
		this.categories = await this.categoryService
			.getCategoriesAdmin()
			.toPromise();
	}

	checkAll() {
		let list = document.getElementsByClassName("selection-checkbox");
		this.allChecked = !this.allChecked;
		for (let i = 0; i < list.length; i++) {
			(<HTMLInputElement>list[i]).checked = this.allChecked;
		}
		this.checkNum = list.length;
	}

	checkItemCliked() {
		let list = document.getElementsByClassName("selection-checkbox");
		this.allChecked = true;
		this.checkNum = 0;
		for (let i = 0; i < list.length; i++) {
			let elt = <HTMLInputElement>list[i];
			this.allChecked = this.allChecked && elt.checked;
			this.checkNum += elt.checked ? 1 : 0;
		}
	}

	onDateFilterChange(val) {
		if (val !== null && val !== undefined && val !== "") {
			let d = new Date(val);
			this.filter.date = d.toLocaleDateString();
		} else {
			this.filter.date = "";
		}
	}

	openConfimModal() {
		this.display = true;
	}

	openProgressModal() {
		this.showSpinner = true;
	}

	onCloseHandled() {
		this.display = this.showSpinner = false;
	}

	export()
	{
		if(this.selectedItems[0].id == 1)
			this.exportCategory();
		else
			this.exportGroups();
	}

	exportGroups() {
		this.onCloseHandled();
		this.isLoading = true;
		this.param = [];
		let kbNeeded = 0;
		//this.kbNeeded = Utils.getReadableFileSizeString(kbNeeded);
		let list = document.getElementsByClassName('selection-checkbox');
		for (let i = 0, t = list.length; i < t; i++) {
			let elt = (<HTMLInputElement>list[i]);
			if (elt.checked) {
				let eltId = parseInt(elt.name);
				this.groups.forEach( async (g) => {
				if (g.id == eltId) {
					let archives = await this.archiveService.allOfGroup(g.id).toPromise();
					archives.forEach((a: Archive) => {
					if(this.param.indexOf(a.path) < 0){
						this.param.push(a.path);
						kbNeeded += parseInt(a.size);
						this.kbNeeded = Utils.getReadableFileSizeString(kbNeeded);
					}
					});

				}
				});
			}

		}
		this.kbNeeded = Utils.getReadableFileSizeString(kbNeeded);
		this.display = true;
		this.isLoading = false;
	}

	exportCategory() {
		this.onCloseHandled();
		this.isLoading = true;
		this.param = [];
		let kbNeeded = 0;
		//this.kbNeeded = Utils.getReadableFileSizeString(kbNeeded);
		let list = document.getElementsByClassName('selection-checkbox');

		for (let i = 0, t = list.length; i < t; i++) {
			let elt = (<HTMLInputElement>list[i]);
			if (elt.checked) {
				let eltId = parseInt(elt.name);
				this.categories.forEach(async (c) => {
					if (c.id == eltId) {

						let archives = await this.archiveService.allOfCategory(c.id).toPromise();
						archives.forEach((a: Archive) => {
							if (this.param.indexOf(a.path) < 0) {
								this.param.push(a.path);
								kbNeeded += parseInt(a.size);
								this.kbNeeded = Utils.getReadableFileSizeString(kbNeeded);
							}
						});

					}
				});
			}

		}


		this.kbNeeded = Utils.getReadableFileSizeString(kbNeeded);
		this.display = true;
		this.isLoading = false;
	}

	exportFiles() {
		this.display = false;
		this.percentDone = 0;
		this.showSpinner = true;

		this.loadResourceService
			.exportToZip(this.param)
			.subscribe((event: HttpEvent<any>) => {
				switch (event.type) {
					case HttpEventType.Sent:
						this.showSpinner = true;
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
						this.showSpinner = false;
						this.downloadBlob(event.body);
				}
			});
	}

	downloadBlob(blob: Blob) {
		this.showSpinner = false;
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

	onItemSelect(item: any) {
		this.selectedItems.push(item);
		if (item.id == 1) this.data = this.categories;
		else this.data = this.groups;
	}

	onItemDeSelect(item: any) {
		this.selectedItems.pop();
		this.data = [];
	}
}
