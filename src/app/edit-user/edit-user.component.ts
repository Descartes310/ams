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

@Component({
	selector: "app-edit-user",
	templateUrl: "./edit-user.component.html",
	styleUrls: ["./edit-user.component.scss"]
})
export class EditUserComponent implements OnInit {
	addUserForm: FormGroup;
	idToDelete: number;
	userId: string;
	user: User;
	showDeleteUserModal = false;
	loading = false;
	roles: Role[] = [];
	groups: Group[] = [];
	dropdownListAmpliation = [];
	dropdownSettingsAmpliation = {};
	selectedItemsAmpliation: Group[] = [];
	dropdownListRole = [];
	dropdownSettingsRole = {};
	selectedItemsRole: Role[] = [];
	isSubmitted = false;
	returnUrl: string;
	private alert: AlertService;

	/**
	 * Used to perform AOT compilation because getAddUserForm.grade  is readonly and cannot be used for two way binding
	 */
	selectGrade;

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

	public get getAddUserForm() {
		return this.addUserForm.controls;
	}

	async ngOnInit() {
		this.addUserForm = this.formBuilder.group({
			firstName: [
				"",
				Validators.compose([
					Validators.required,
					Validators.minLength(3),
					Validators.maxLength(20)
				])
			],
			lastName: [
				"",
				Validators.compose([
					Validators.required,
					Validators.minLength(3),
					Validators.maxLength(20)
				])
			],
			email: ["", Validators.compose([Validators.required, Validators.email])],
			grade: [""],
			login: [""],
			telephone: [
				"",
				Validators.compose([
					Validators.required,
					Validators.pattern("^6[5679][0-9]{7}")
				])
			],
			password: [""],
			roles: [],
			groups: []
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

		this.userId = this.route.snapshot.paramMap.get("id");
		await this.getUser();
	}

	//This function is used to fetch the selected user before update and initialize all form fields with
	//this user's properties
	async getUser() {
		await this.userService
			.getUser(this.userId)
			.toPromise()
			.then((data: User) => {
				this.user = data;
				this.getAddUserForm.lastName.setValue(this.user.lastName);
				this.getAddUserForm.firstName.setValue(this.user.firstName);
				this.getAddUserForm.login.setValue(this.user.login);
				this.getAddUserForm.password.setValue(this.user.password);
				this.getAddUserForm.telephone.setValue(this.user.telephone);
				this.getAddUserForm.grade.setValue(this.user.grade);
				this.getAddUserForm.email.setValue(this.user.email);
				this.selectedItemsAmpliation = this.user.groups;
				this.selectedItemsRole = this.user.roles;
				this.selectGrade = this.user.grade;
			})
			.catch((err: HttpErrorResponse) => {
				this.alertService.error("" + err);
				this.router.navigate(["/admin/users"]);
			});
	}

	//This function is used to get all roles
	async getRoles() {
		await this.roleService.getRoles().subscribe((data: Role[]) => {
			this.dropdownListRole = data;
		});
	}

	//This function is used to get all groups
	async getGroups() {
		await this.groupService.getGroups().subscribe((data: Group[]) => {
			this.dropdownListAmpliation = data;
		});
	}

	//This function is used to add a new group after form submission
	async onSubmit() {
		this.isSubmitted = true;
		if (this.addUserForm.invalid) {
			this.loading = false;
			return;
		}
		this.loading = true;
		await this.userService
			.editUser(
				this.getAddUserForm.firstName.value,
				this.getAddUserForm.lastName.value,
				this.getAddUserForm.email.value,
				this.getAddUserForm.login.value,
				this.getAddUserForm.password.value,
				this.getAddUserForm.telephone.value,
				this.getAddUserForm.grade.value,
				this.selectedItemsAmpliation,
				this.selectedItemsRole,
				this.user.id
			)
			.then(data => {
				this.alertService.success("Utilisateur édité avec succès !");
				this.loading = false;
				this.router.navigate(["/admin/users"]);
			})
			.catch((err: HttpErrorResponse) => {
				this.alertService.error("" + err);
				this.loading = false;
			});
	}

	//this function is used to set list of ampliation and role
	onItemSelectA(item: any) {
		this.selectedItemsAmpliation.push(item);
	}
	onItemDeSelectA(item: any) {
		let role = this.selectedItemsAmpliation.filter(x => x.id === item.id)[0];
		var index = this.selectedItemsAmpliation.indexOf(role);
		if (index > -1) {
			this.selectedItemsAmpliation.splice(index, 1);
		}
	}
	onItemDeSelectR(item: any) {
		let role = this.selectedItemsRole.filter(x => x.id === item.id)[0];
		var index = this.selectedItemsRole.indexOf(role);
		if (index > -1) {
			this.selectedItemsRole.splice(index, 1);
		}
	}
	onItemSelectR(item: any) {
		this.selectedItemsRole.push(item);
	}
	onSelectAllA(items: any) {
		this.selectedItemsAmpliation = items;
	}
	onSelectAllR(items: any) {
		this.selectedItemsRole = items;
	}

	/**
	 * Called on grade select change
	 */
	updateFormGrade(){
		this.getAddUserForm.grade.setValue(this.selectGrade);
	}
}
