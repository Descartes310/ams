import { Component, OnInit, OnDestroy } from "@angular/core";
import { Http, Response } from "@angular/http";
import { Subject } from "rxjs";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Router, ActivatedRoute } from "@angular/router";
import { RoleService } from "../services/role.service";
import * as CONST from "../app-const";
import { Role } from "../models/role.model";
import { UserService } from "../services/user.service";
import { User } from "../models/user.model";
import { AlertService } from "../services/alert.service";
import { AuthenticationService } from "../services/authentication.service";

@Component({
  selector: "app-users",
  templateUrl: "./users.component.html",
  styleUrls: ["./users.component.scss"]
})
export class UsersComponent implements OnInit {
  allUsers: User[] = [];
  data: User[] = [];
  roles: Role[] = [];
  user: User;
  idToDelete: number;
  returnUrl: string;
  showDeleteUserModal = false;
  loading = false;
  mainLoading = true;
  showUserModal = false;
  canEdit = false;
  canBlock = false;
  blockLoading = false;
  private alert: AlertService;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private roleService: RoleService,
    private userService: UserService,
    private alertService: AlertService,
    private authService: AuthenticationService
  ) {
    this.alert = alertService;
  }

  async ngOnInit() {
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams["returnUrl"] || "/admin/role";
    this.getRoles();
    this.getUsers();
    this.canEdit = await this.authService.hasPrivilege(22);
    this.canBlock = await this.authService.hasPrivilege(24);
  }

  //This function is used to get roles
  async getRoles() {
    await this.roleService.getRoles().subscribe((data: Role[]) => {
      this.roles = data;
    });
  }

  //This function is used to get users
  async getUsers() {
    await this.userService.getUsers().toPromise()
    .then((data: User[]) => {
      this.data = data;
      this.allUsers = data;
      this.mainLoading = false;
		}).catch((err: HttpErrorResponse) => {
      this.alert.error(''+err);
      this.mainLoading = false;
    })
  }

  //this function is used to block/deblock user
  async block(id: number, status: boolean) {
    this.blockLoading = true;
    await this.userService.blockUser(id, status)
    .then((data) => {
      if (status) {
				this.alertService.success(
					"Utilisateur bloqué avec succès !"
				);
				this.data.filter(x => x.id === id)[0].isBlocked = true;
			} else {
				this.alertService.success(
					"Utilisateur debloqué avec succès !"
				);
				this.data.filter(x => x.id === id)[0].isBlocked = false;
			}
    })
    .catch((err: HttpErrorResponse) => {
       this.alertService.error(
					""+err
				);
				this.blockLoading = false;
    });
  }

  //This function is used by dataTable to filter elements
  search(term: string) {
    console.log(this.roles);
    if (!term) {
      this.data = this.allUsers;
    } else {
        this.data = this.allUsers
        .filter(
          x => x.firstName
          .trim()
          .toLowerCase()
          .includes(term.trim().toLowerCase()) || x.lastName
          .trim()
          .toLowerCase()
          .includes(term.trim().toLowerCase()));
      }
  }

  editUser(userId: number) {
    this.router.navigate(["/admin/users", userId]);
  }

  //This function is used to set user id before deleting
  setIdToDetele(userId: number) {
    this.showDeleteUserModal = true;
    this.idToDelete = userId;
  }

  //This function is use to delete a role
  async deleteUser() {
    if (this.idToDelete != null) {
      await this.userService.deleteUser(
        this.idToDelete
      )
      .then((data) => {
        this.showDeleteUserModal = false;
				this.alertService.success(
					"Utilisateur supprimé avec succès !"
				);
				this.getUsers();
      })
      .catch((err: HttpErrorResponse) => {
        this.showDeleteUserModal = false;
				this.alertService.error(
					""+err
				);
				this.loading = false;
      });
    } else {
      this.showDeleteUserModal = false;
      this.alertService.error("Identifiant de l'élément introuvable !");
      this.loading = false;
    }
  }

  //This function return all details about the selected log
  details(id: number) {
    this.user = this.data.filter(x => x.id === id)[0];
    this.showUserModal = true;
  }
}
