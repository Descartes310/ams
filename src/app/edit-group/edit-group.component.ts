import { Component, OnInit } from "@angular/core";
import { HttpErrorResponse } from "@angular/common/http";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AlertService } from "../services/alert.service";
import { Router, ActivatedRoute } from "@angular/router";
import { GroupService } from "../services/group.service";
import { Group } from "../models/group.model";
import { User } from "../models/user.model";
import { UserService } from "../services/user.service";

@Component({
	selector: "app-edit-group",
	templateUrl: "./edit-group.component.html",
	styleUrls: ["./edit-group.component.scss"]
})
export class EditGroupComponent implements OnInit {
	/* variables declaration */
	group: Group;
	addEmpliationForm: FormGroup;
	addGroupMemberForm: FormGroup;
	loading = false;
	isSubmitted = false;
	users: User[];
	name: string;
	dropdownListUser = [];
	dropdownSettingsUser = {};
	selectedItemsUser: User[] = [];
	description: string;
	groupId: string;
	returnUrl: string;

	constructor(
		private formBuilder: FormBuilder,
		private route: ActivatedRoute,
		private router: Router,
		private alertService: AlertService,
		private groupService: GroupService,
		private userService: UserService
	) {}

	get getAddEmpliationForm() {
		return this.addEmpliationForm.controls;
	}

	get getAddGroupMemberForm() {
		return this.addGroupMemberForm.controls;
	}

	async ngOnInit() {
		this.addEmpliationForm = this.formBuilder.group({
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

		this.dropdownSettingsUser = {
			singleSelection: false,
			idField: "id",
			textField: "name",
			selectAllText: "Sélectionner tout",
			unSelectAllText: "Désélectionner tout",
			allowSearchFilter: true
		};

		this.groupId = this.route.snapshot.paramMap.get("id");

		await this.getGroup();
		this.getUsers();
	}

	async getGroup() {
		await this.groupService
			.getGroup(this.groupId)
			.toPromise()
			.then((data: Group) => {
				this.group = data;
				this.getAddEmpliationForm.name.setValue(this.group.name);
				this.getAddEmpliationForm.description.setValue(this.group.description);
				for (let index = 0; index < this.group.users.length; index++) {
					let user = this.group.users[index];
					this.selectedItemsUser.push(user);
					this.selectedItemsUser[index]["name"] =
						user.grade + " " + user.firstName + " " + user.lastName;
				}
				this.selectedItemsUser = this.group.users;
			})
			.catch((err: HttpErrorResponse) => {
				this.alertService.error("" + err);
				this.router.navigate(["/admin/groups"]);
			});
	}

	//This function is used to get roles
	async getUsers() {
		await this.userService.getUsers().subscribe((data: User[]) => {
			this.dropdownListUser = data;
			//This loop is used to provides a full user's name
			for (let index = 0; index < this.dropdownListUser.length; index++) {
				this.dropdownListUser[index]["name"] =
					this.dropdownListUser[index].grade +
					" " +
					this.dropdownListUser[index].firstName +
					" " +
					this.dropdownListUser[index].lastName;
			}
		});
	}

	//This function is used to update a existing group after form submission
	async editGroup() {
		//it check if the forms fields are filled correctly
		this.isSubmitted = true;
		if (this.addEmpliationForm.invalid) {
			this.loading = false;
			return;
		}

		this.loading = true;
		await this.groupService.editGroup(
			this.getAddEmpliationForm.name.value,
			this.getAddEmpliationForm.description.value,
			this.selectedItemsUser,
			this.group.id
		)
		.then((data) => {
			this.group.users = this.selectedItemsUser;
			this.getAddEmpliationForm.name.setValue(
				this.getAddEmpliationForm.name.value
			);
			this.getAddEmpliationForm.description.setValue(
				this.getAddEmpliationForm.description.value
			);
			this.alertService.success(
				"Le groupe a été éditée avec succès !"
			);
			this.loading = false;
			this.router.navigate(["/admin/groups"]);
		})
		.catch((err: HttpErrorResponse) => {
			this.alertService.error(
				""+err
			);
			this.loading = false;
		});
	}


	//these function is used to set users selection list
	onItemSelect(item: any) {
		this.selectedItemsUser.pop();
		this.selectedItemsUser.push(item);
	}
	onSelectAll(items: any) {
		this.selectedItemsUser = items;
	}
	onItemDeSelect(item: any) {
		let role = this.selectedItemsUser.filter(x => x.id === item.id)[0];
		var index = this.selectedItemsUser.indexOf(role);
		if (index > -1) {
			this.selectedItemsUser.splice(index, 1);
		}
	}
	onItemDeSelectId(id: number) {
		let role = this.selectedItemsUser.filter(x => x.id === id)[0];
		var index = this.selectedItemsUser.indexOf(role);
		if (index > -1) {
			this.selectedItemsUser.splice(index, 1);
		}
	}
}
