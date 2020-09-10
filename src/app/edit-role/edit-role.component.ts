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
import { Role } from "../models/role.model";
import * as CONST from "../app-const";
import { User } from "../models/user.model";
import { UserService } from "../services/user.service";

@Component({
	selector: "app-edit-role",
	templateUrl: "./edit-role.component.html",
	styleUrls: ["./edit-role.component.scss"]
})
export class EditRoleComponent implements OnInit {
	addRoleForm: FormGroup;
	privileges: Privilege[] = [];
	name: string;
	public role: Role;
	description: string;
	checkAll = false;
	roleId: string;
	loading = false;
	checkboxs = [];
	selectedPrivilege: Privilege[] = [];
	dropdownSettings = {};
	selectedItemsUser: User[] = [];
	dropdownList = [];
	isSubmitted = false;
	private alert: AlertService;

	constructor(
		private formBuilder: FormBuilder,
		private route: ActivatedRoute,
		private router: Router,
		private alertService: AlertService,
		private privilegeService: PrivilegeService,
		private roleService: RoleService,
		private userService: UserService
	) {
		this.alert = alertService;
	}

	get getAddRoleForm() {
		return this.addRoleForm.controls;
	}

	async ngOnInit() {
		this.addRoleForm = this.formBuilder.group({
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
			users: []
		});

		this.dropdownSettings = {
			singleSelection: false,
			idField: "id",
			textField: "name",
			selectAllText: "Sélectionner tout",
			unSelectAllText: "Désélectionner tout",
			allowSearchFilter: true
		};

		this.roleId = this.route.snapshot.paramMap.get("id");

		await this.getRole();
		await this.getPrivileges();
		await this.getUsers();
		this.selectedPrivilege = this.role.privileges;
		for (let privilege of this.selectedPrivilege) {
			this.checkboxs[privilege.id] = true;
		}
	}

	async getRole() {
		await this.roleService
			.getRole(this.roleId)
			.toPromise()
			.then((data: Role) => {
				this.role = data;
				this.getAddRoleForm.name.setValue(this.role.name);
				this.getAddRoleForm.description.setValue(this.role.description);
				for (let index = 0; index < this.role.users.length; index++) {
					let user = this.role.users[index]; 
					this.selectedItemsUser.push(user);
					this.selectedItemsUser[index]["name"] =
						user.grade +
						" " +
						user.firstName +
						" " +
						user.lastName;
				}
				this.selectedItemsUser = this.role.users;
			})
			.catch((err: HttpErrorResponse) => {
				this.alertService.error("" + err);
				this.router.navigate(["/admin/roles"]);
			});
	}

	//This function is used to get users
	async getUsers() {
		await this.userService.getUsers().subscribe((data: User[]) => {
			this.dropdownList = data;
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

	//This function is used to get all privileges
	async getPrivileges() {
		await this.privilegeService
			.getAllPrivileges()
			.subscribe((data: Privilege[]) => {
				this.privileges = data;
			});
	}

	//This function is used to edit an existing group after form submission
	async onSubmit() {
		this.isSubmitted = true;
		if (this.addRoleForm.invalid) {
			this.loading = false;
			return;
		}
		if (
			this.selectedItemsUser == null ||
			this.selectedItemsUser.length < 1 ||
			!this.selectedItemsUser
		) {
			this.alertService.error(
				"Le rôle doit contenir au moins un utilisateur !"
			);
			this.loading = false;
			return;
		}
		this.loading = true;
		await this.roleService
			.editRole(
				this.getAddRoleForm.name.value,
				this.getAddRoleForm.description.value,
				this.selectedPrivilege,
				this.selectedItemsUser,
				this.role.id
			)
			.then(data => {
				this.alertService.success("Rôle édité avec succès !");
				this.loading = false;
				this.router.navigate(["/admin/roles"]);
			})
			.catch((err: HttpErrorResponse) => {
				this.alertService.error("" + err);
				this.loading = false;
			});
	}

	//This method is using to construct the selected privileges array
	setChecked(id: number) {
		//if privilege is selected, we're finding it and push it into array
		if (this.checkboxs[id] == true) {
			let privilege = this.privileges.filter(x => x.id === id)[0];
			this.selectedPrivilege.push(privilege);
		}
		//if it is not selected, we are trying to it and remove it from table
		else {
			this.selectedPrivilege = this.selectedPrivilege.filter(
				x => x.id !== id
			);
			console.log(this.selectedPrivilege);
		}
	}

	//these function are used to set user list
	onItemSelect(item: any) {
		this.selectedItemsUser.push(item);
	}

	onItemDeSelect(item: any) {
		let role = this.selectedItemsUser.filter(x => x.id === item.id)[0];
		var index = this.selectedItemsUser.indexOf(role);
		if (index > -1) {
			this.selectedItemsUser.splice(index, 1);
		}
	}

	onSelectAll(items: any) {
		this.selectedItemsUser = items;
	}
}
