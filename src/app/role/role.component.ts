import { Component, OnInit, OnDestroy } from "@angular/core";
import { Http, Response } from "@angular/http";
import { Subject } from "rxjs";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { AlertService } from "../services/alert.service";
import { Router, ActivatedRoute } from "@angular/router";
import { RoleService } from "../services/role.service";
import { NotifierService } from "angular-notifier";
import * as CONST from "../app-const";
import { Role } from "../models/role.model";

@Component({
  selector: "app-role",
  templateUrl: "./role.component.html",
  styleUrls: ["./role.component.scss"]
})
export class RoleComponent implements OnInit {
  allRoles: Role[] = [];
  data: Role[] = [];
  role: Role;
  idToDelete: number;
  returnUrl: string;
  showDeleteRoleModal = false;
  showRoleModal = false;
  loading = false;
  mainLoading = true;
  private alert: AlertService;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private alertService: AlertService,
    private roleService: RoleService
  ) {
    this.alert = alertService;
  }

  ngOnInit() {
    this.getRoles();
  }

  //This function is used to get roles
  async getRoles() {
    await this.roleService.getRoles().toPromise().then((data: Role[]) => {
      this.data = data;
      this.allRoles = data;
      this.mainLoading = false;
    })
    .catch((err: HttpErrorResponse) => {
      this.alert.error(""+err);
      this.mainLoading = false;
    });
  }

  //This function is used by dataTable to filter elements
  search(term: string) {
    if (!term) {
      this.data = this.allRoles;
    } else {
      this.data = this.allRoles.filter(x => x.name
          .trim()
          .toLowerCase()
          .includes(term.trim().toLowerCase()));
    }
  }

  editRole(roleId: number) {
    this.router.navigate(["/admin/roles", roleId]);
  }

  //This function is used to set role id before deleting
  setIdToDetele(roleId: number) {
    this.showDeleteRoleModal = true;
    this.idToDelete = roleId;
  }

  //This function is use to delete a role
  async deleteRole() {
    if (this.idToDelete != null) {
      await this.roleService.deleteRole(
        this.idToDelete
      )
      .then((data) => {
        this.showDeleteRoleModal = false;
				this.alertService.success(
					"Le rôle a été supprimé avec succès !"
				);
				this.getRoles();
      })
      .catch((err: HttpErrorResponse) => {
        this.showDeleteRoleModal = false;
				this.alertService.error(
					""+err
				);
				this.loading = false;
      });
    } else {
      this.showDeleteRoleModal = false;
      this.alertService.error("Identifiant de l'élément est introuvable !");
      this.loading = false;
    }
  }
  //This function return all details about the selected log
  details(id: number) {
    this.role = this.data.filter(x => x.id === id)[0];
    this.showRoleModal = true;
  }
}
