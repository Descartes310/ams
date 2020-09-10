import { Component, OnInit, OnDestroy } from "@angular/core";
import { Http, Response } from "@angular/http";
import { Subject } from "rxjs";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AlertService } from "../services/alert.service";
import { Router, ActivatedRoute } from "@angular/router";
import { GroupService } from "../services/group.service"
import { Group } from "../models/group.model";
import * as CONST from "../app-const";
import { error } from "util";

@Component({
  selector: "app-empliation",
  templateUrl: "./empliation.component.html",
  styleUrls: ["./empliation.component.scss"]
})
export class EmpliationComponent implements OnInit {
  allGroups: Group[] = [];
  data: Group[] = [];
  idToDelete: number;
  showAddGroupModal = false;
  showDeleteGroupModal = false;
  addEmpliationForm: FormGroup;
  loading = false;
  mainLoading = true;
  isSubmitted = false;
  name: string;
  description: string;
  returnUrl: string;
  private alert: AlertService;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private alertService: AlertService,
    private groupService: GroupService
  ) {
    this.alert = alertService;
  }

  get getAddEmpliationForm() {
    return this.addEmpliationForm.controls;
  }

  ngOnInit() {

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
      ]
    });
    this.getGroups();
  }

  //This function is used to get all groups
  getGroups(): void {
		this.groupService.getGroups().toPromise()
		.then((data: Group[]) => {
			this.data = data;
			this.allGroups = data;
      this.mainLoading = false;
		})
		.catch((err: HttpErrorResponse) => {
      this.alert.error(''+err);
      this.mainLoading = false;
    })
  }

  //This function is used to add a new group after form submission
  async onSubmit() {
    this.isSubmitted = true;
    if (this.addEmpliationForm.invalid) {
      this.loading = false;
      return;
    }
    this.loading = true;
    await this.groupService.addGroup(
      this.getAddEmpliationForm.name.value,
      this.getAddEmpliationForm.description.value
    )
    .then((data) => {
      this.showAddGroupModal = false;
      this.alertService.success(
        "Nouveau groupe ajouté avec succès !"
      );
      this.loading = false;
      this.showAddGroupModal = false;
      this.getGroups();
    })
    .catch((err: HttpErrorResponse) => {
      this.alertService.error(""+err);
      this.showAddGroupModal = false;
      this.loading = false;
    });
  }

  //This function is used by dataTable to filter elements
  search(term: string) {
    if (!term) {
      this.data = this.allGroups;
    } else {
      this.data = this.allGroups.filter(x => x.name
          .trim()
          .toLowerCase()
          .includes(term.trim().toLowerCase()));
    }
  }

  //This function allow us to access to edit group page, its param is a group id
  editGroup(groupId: number) {
    this.router.navigate(["/admin/groups", groupId]);
  }

  //This function is used to set group id before deleting
  setIdToDetele(groupId: number) {
    this.showDeleteGroupModal = true;
    this.idToDelete = groupId;
  }
  //This function is use to delete a group
  async deleteGroup() {
    if (this.idToDelete != null) {
      await this.groupService.deleteGroup(
        this.idToDelete
      )
      .then((data) => {
        this.showDeleteGroupModal = false;
        this.alertService.success(
          "Groupe modifié avec succès !"
        );
        this.getGroups();
      })
      .catch((err: HttpErrorResponse) => {
        this.showDeleteGroupModal = false;
        this.alertService.error(""+error);
        this.loading = false;
      });
    } else {
      this.showDeleteGroupModal = false;
      this.alertService.error("Identifiant de l'élement introuvable !");
      this.loading = false;
    }
  }
}
