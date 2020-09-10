import { Component, OnInit, OnDestroy } from "@angular/core";
import { Http, Response } from "@angular/http";
import { Subject } from "rxjs";
import { HttpClient, HttpResponse, HttpErrorResponse } from "@angular/common/http";
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

@Component({
	selector: "app-add-user",
	templateUrl: "./add-user.component.html",
	styleUrls: ["./add-user.component.scss"]
})
export class AddUserComponent implements OnInit {
	/* variables declaration */
	addUserForm: FormGroup;
	idToDelete: number;
	showDeleteUserModal = false;
	loading = false;
	roles: Role[] = [];
	groups: Group[] = [];
	dropdownListAmpliation = [];
	dropdownSettingsAmpliation = {};
	selectedItemsAmpliation: Group[] = [];
	dropdownListRole = [];
	publicGroup: Group;
	dropdownSettingsRole = {};
	selectedItemsRole: Role[] = [];
	isSubmitted = false;
	returnUrl: string;
	private alert: AlertService;

	constructor(
		private formBuilder: FormBuilder,
		private route: ActivatedRoute,
		private router: Router,
		private roleService: RoleService,
		private userService: UserService,
		private groupService: GroupService,
		private alertService: AlertService
	) {
		this.alert = alertService;
	}

	ngOnInit() {
		this.addUserForm = this.formBuilder.group({
			firstName: [
				"",
				Validators.compose([
					Validators.required,
					Validators.minLength(2),
					Validators.maxLength(50)
				])
			],
			lastName: [
				"",
				Validators.compose([
					Validators.required,
					Validators.minLength(2),
					Validators.maxLength(50)
				])
			],
			email: [
				"", 
				Validators.compose([
					Validators.required, 
					Validators.email
				])],
			grade: [""],
			login: [
				"",
				Validators.compose([
					Validators.required,
					Validators.minLength(3),
					Validators.maxLength(20)
				])
			],
			telephone: [
				"",
				Validators.compose([
					Validators.required,
					Validators.pattern("^6[5679][0-9]{7}")
				])
			],
			password: [
				"",
				Validators.compose([Validators.required, Validators.minLength(3)])
			]
		});
		this.getRoles();
		this.getGroups();
		this.dropdownSettingsAmpliation = {
			singleSelection: false,
			idField: "id",
			textField: "name",
			selectAllText: "Sélectionner tout",
			unSelectAllText: "Désélectionner tout",
			allowSearchFilter: true
		};
		this.dropdownSettingsRole = {
			singleSelection: false,
			idField: "id",
			textField: "name",
			selectAllText: "Sélectionner tout",
			unSelectAllText: "Désélectionner tout",
			allowSearchFilter: true
		};
	}

	get getAddUserForm() {
		return this.addUserForm.controls;
	}

	//This function is used to get all roles
	async getRoles() {
		await this.roleService.getRoles().subscribe((data: Role[]) => {
			this.dropdownListRole = data //this line initialize the select list for roles
		});
	}

	//This function is used to get all groups
	getGroups(): void {
		this.groupService.getGroups().subscribe((data: Group[]) => {
			this.dropdownListAmpliation = data.filter(role => role.name.toLowerCase() != 'public');; //this line initialize the select list for group
			this.publicGroup = data.filter(
				role => role.name.toLowerCase() == "public"
			)[0];

		});
	}

	//This function is used to add a new group after form submission
	async onSubmit() {
		//it check if fields are filled correctly
		this.isSubmitted = true;
		if (this.addUserForm.invalid) {
			this.loading = false;
			return;
		}
		this.loading = true;
		this.selectedItemsAmpliation.push(this.publicGroup);
		await this.userService.addUser(
			this.getAddUserForm.firstName.value,
			this.getAddUserForm.lastName.value,
			this.getAddUserForm.email.value,
			this.getAddUserForm.login.value,
			this.getAddUserForm.password.value,
			this.getAddUserForm.telephone.value,
			this.getAddUserForm.grade.value,
			this.selectedItemsAmpliation,
			this.selectedItemsRole
		)
		.then((data) => {
			this.alertService.success(
					"Nouvel utilisateur ajouté avec succès !"
				);
			this.loading = false;
			this.router.navigate(["/admin/users"]);
		})
		.catch((err: HttpErrorResponse) => {
			this.alertService.error(
				""+err
			);
			this.loading = false;
		});
	}

	//these function are used to set role and ampliation list
	onItemSelectA(item: any) {
		this.selectedItemsAmpliation.push(item);
	}
	onItemSelectR(item: any) {
		this.selectedItemsRole.push(item);
	}

	onItemDeSelectR(item: any) {
		let role = this.selectedItemsRole.filter(x => x.id === item.id)[0];
		var index = this.selectedItemsRole.indexOf(role);
		if (index > -1) {
			this.selectedItemsRole.splice(index, 1);
		}
	}

	onItemDeSelectA(item: any) {
		let group = this.selectedItemsAmpliation.filter(x => x.id === item.id)[0];
		var index = this.selectedItemsAmpliation.indexOf(group);
		if (index > -1) {
			this.selectedItemsAmpliation.splice(index, 1);
		}
	}

	onSelectAllA(items: any) {
		this.selectedItemsAmpliation = items;
	}
	onSelectAllR(items: any) {
		this.selectedItemsRole = items;
	}
}
