import { Component, OnInit, OnDestroy } from "@angular/core";
import { Http, Response } from "@angular/http";
import { Subject } from "rxjs";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AlertService } from "../services/alert.service";
import { Router, ActivatedRoute } from "@angular/router";
import { MetadataService } from "../services/metadata.service";
import { NotifierService } from "angular-notifier";
import * as CONST from "../app-const";
import { Log } from "../models/log.model";
import { LogService } from "../services/log.service";
import { UserService } from "../services/user.service";
import { User } from "../models/user.model";
import { AuthenticationService } from "../services/authentication.service";

@Component({
	selector: "app-logs",
	templateUrl: "./logs.component.html",
	styleUrls: ["./logs.component.scss"]
})
export class LogsComponent implements OnInit {
	data: Log[] = [];
	endIsEmpty = true;
	startIsEmpty = true;
	allLogs: Log[] = [];
	log: Log;
	searchForm: FormGroup;
	parameters: any = [];
	showAddLogModal = false;
	loadingDelete = false;
	loadingSearch = false;
	dropdownList = [];
	dropdownSettings = {};
	selectedItem: User;
	returnUrl: string;
	selectedLog: Log[] = [];
	checkboxs = [];
	private alert: AlertService;

	constructor(
		private formBuilder: FormBuilder,
		private route: ActivatedRoute,
		private router: Router,
		private alertService: AlertService,
		private logService: LogService,
		private userService: UserService,
		private authService: AuthenticationService
	) {
		this.alert = alertService;
	}

	get getSearchForm() {
		return this.searchForm.controls;
	}

	ngOnInit() {
		// get return url from route parameters or default to '/'
		this.returnUrl = this.route.snapshot.queryParams["returnUrl"] || "/logs";
		this.searchForm = this.formBuilder.group({
			startDate: [""],
			endDate: [""],
			user: [],
			status: [""],
			action: [""],
			code: [""]
		});
		this.getUsers();
		this.dropdownSettings = {
			singleSelection: true,
			idField: "id",
			textField: "name",
			allowSearchFilter: true
		};
	}

	async search() {
		this.loadingSearch = true;
		this.data = [];
		this.selectedLog = [];
		await this.logService
			.getLogs(
				this.getSearchForm.startDate.value,
				this.getSearchForm.endDate.value,
				this.getSearchForm.user.value,
				this.getSearchForm.status.value,
				this.getSearchForm.action.value
			)
			.toPromise()
			.then((data: Log[]) => {
				data.forEach(log => {
					this.data.push(log);
					this.checkboxs[log.id]=false;
				});
				this.loadingSearch = false;
			})
			.catch((err: HttpErrorResponse) => {
				this.alert.error(""+err);
				this.loadingSearch = false;
			});
	}

	//This function is used to get users
	async getUsers() {
		await this.userService.getUsers().subscribe((users: User[]) => {
			this.dropdownList = users;
			if (this.authService.isAdmin())
				this.dropdownList.push(this.authService.getUser());

			//This loop is used to provides a full user's name
			for (let index = 0; index < this.dropdownList.length; index++) {
				this.dropdownList[index]["name"] =
					this.dropdownList[index].grade +
					" " +
					this.dropdownList[index].firstName +
					" " +
					this.dropdownList[index].lastName;
			}
		});
	}

	//This function return all details about the selected log
	details(id: number) {
		this.parameters = [];
		var key;
		this.log = this.data.filter(x => x.id === id)[0];
		if (this.log.parameters != "") {
			let tmp = JSON.parse(this.log.parameters);
			for (key in tmp) {
				if (tmp.hasOwnProperty(key)) {
					this.parameters.push({ key: key, value: tmp[key] });
				}
			}
		}
		this.showAddLogModal = true;
	}

	//This function is used to delete many logs at same time
	async deleteMany() {
		let tmpSelectedLog = this.selectedLog;
		if (tmpSelectedLog.length == 0) {
				this.alertService.error("La sélection est vide !");
				return;
			}
		this.loadingDelete = true;
		await this.logService.deleteManyLogs(this.selectedLog)
		.then((data) => {
			this.loadingDelete = false;
			this.search();
			this.alertService.success("La sélection a été supprimée avec succès !");
		})
		.catch((err: HttpErrorResponse) => {
			this.loadingDelete = false;
			this.search();
			this.alertService.error(
				""+err
			);
		});
	}
	//This function is use to delete a log
	async delete(id: number, notify: boolean, search: boolean) {
		await this.logService.deleteLog(id)
		.then((data) => {
			if (notify)
				this.alertService.success(
					"Le log a été supprimé avec succès !"
				);
		})
		.catch((err: HttpErrorResponse) => {
			if (notify)
				this.alertService.error(
					""+err
				);
		});
    	if(search)
			this.search();
	}

	//This function is called when select all / deselect all is changing to set all checkbox
	enabled() {
		this.selectedLog = [];
		for (let log of this.data) {
			this.checkboxs[log.id] = true;
			this.setChecked(log.id);
		}
	}

	disabled() {
		this.selectedLog = [];
		for (let log of this.data) {
			this.checkboxs[log.id] = false;
			//this.setChecked(log.id);
		}
	}

	//This method is using to construct the selected logs array
	setChecked(id: number) {
    //if log is selected, we're finding it and push it in array
    let log = this.selectedLog.filter(x => x.id === id)[0];
		if (! log) {
      let tmpLog = this.data.filter(x => x.id === id)[0];
      this.checkboxs[tmpLog.id] = true;
			this.selectedLog.push(tmpLog);
		}
		//if it is not selected, we are trying to it and remove it from table
		else {
			let log = this.data.filter(x => x.id === id)[0];
			var index = this.selectedLog.indexOf(log);
			if (index > -1) {
				this.selectedLog.splice(index, 1);
			}
    	}
	}

	//these function are used to set user list
	onItemSelect(item: any) {
		this.getSearchForm.user.setValue(item.id);
		this.selectedItem = item;
		console.log(this.selectedItem);
	}

	onItemDeSelect(item: any) {
		this.getSearchForm.user.setValue(null);
		this.selectedItem = null;
	}
	_endIsEmpty() {
    this.endIsEmpty = false;
  }

	_startIsEmpty() {
    this.startIsEmpty = false;
  }

	_endIsEmptyBlur() {
    this.endIsEmpty = true;
  }

	_startIsEmptyBlur() {
    this.startIsEmpty = true;
  }
}
