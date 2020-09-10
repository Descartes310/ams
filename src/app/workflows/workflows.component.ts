import { Component, OnInit } from "@angular/core";
import { HttpErrorResponse } from "@angular/common/http";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AlertService } from "../services/alert.service";
import { Router } from "@angular/router";
import { Workflow } from "../models/workflow.model";
import { WorkflowService } from "../services/workflow.service";
import { formatDate } from "@angular/common";

@Component({
	selector: "app-workflows",
	templateUrl: "./workflows.component.html",
	styleUrls: ["./workflows.component.scss"]
})
export class WorkflowsComponent implements OnInit {
	allPlannifications: Workflow[] = [];
	data: Workflow[] = [];
	idToDelete: number;
	showAddModal = false;
	showDeleteModal = false;
	addForm: FormGroup;
	loading = false;
	mainLoading = true;
	isSubmitted = false;
	name: string;
	description: string;
	today: string;
	hour: string;

	constructor(
		private formBuilder: FormBuilder,
		private router: Router,
		private alertService: AlertService,
		private workflowService: WorkflowService
	) {}

	get getAddForm() {
		return this.addForm.controls;
	}

	ngOnInit() {
		this.addForm = this.formBuilder.group({
			name: [
				"",
				Validators.compose([Validators.required, Validators.minLength(3)])
			],
			date: ["", Validators.compose([Validators.required])],
			time: ["", Validators.compose([Validators.required])],
			task: ["", Validators.compose([Validators.required])]
		});
		this.today = formatDate(new Date(), "yyyy-MM-dd", "en-US");
		this.hour = formatDate(new Date(), "HH:mm", "en-US");
		this.getPlannifications();
	}

	//This function is used to get all plannifications
	getPlannifications(): void {
		this.workflowService
			.getPlannifications()
			.toPromise()
			.then((data: Workflow[]) => {
				this.data = data;
				this.allPlannifications = data;
				this.mainLoading = false;
			})
			.catch((err: HttpErrorResponse) => {
				this.alertService.error(""+err);
				this.mainLoading = false;
			});
	}

	//this function is used to block/deblock plannification
	async block(id: number, status: boolean) {
		let workflow: Workflow = this.data.filter(plannification => plannification.id === id)[0];
		if (workflow.date + "" < this.today) {
			this.alertService.error(
				"Evènement déjà passé, impossible de réactiver !"
			);
			return;
		}
		if (workflow.date+"" == this.today) {
			if (workflow.time+"" <= this.hour) {
				this.alertService.error(
					"Evènement déjà passé, impossible de réactiver !"
				);
				return;
			}
		}
		await this.workflowService.block(id, status)
		.then((data) => {
			if (status) {
				this.alertService.success(
					"Plannification désactivée avec succès !"
				);
				this.data.filter(x => x.id === id)[0].isActive = true;
			} else {
				this.alertService.success(
					"Plannification activée avec succès !"
				);
				this.data.filter(x => x.id === id)[0].isActive = false;
			}
		})
		.catch((err: HttpErrorResponse) => {
			this.alertService.error(
				""+err
			);
		});
	}

	//This function is used by dataTable to filter elements
	search(term: string) {
		console.log(this.data);
		if (!term) {
			this.data = this.allPlannifications;
		} else {
			this.data = this.allPlannifications.filter(x =>
				x.name
					.trim()
					.toLowerCase()
					.includes(term.trim().toLowerCase())
			);
		}
	}

	//This function allow us to access to edit group page, its param is a group id
	editPlannification(plannificationId: number) {
		this.router.navigate(["/admin/workflows", plannificationId]);
	}

	//This function is used to set group id before deleting
	setIdToDetele(plannificationId: number) {
		this.showDeleteModal = true;
		this.idToDelete = plannificationId;
	}

  //This function is use to delete a role
  async deleteWorkflow() {
    if (this.idToDelete != null) {
      await this.workflowService
		.deletePlannification(this.idToDelete)
		.then(data => {
			this.showDeleteModal = false;
			this.alertService.success(
				"La plannififcation a été supprimée avec succès !"
			);
			this.getPlannifications();
		})
		.catch((err: HttpErrorResponse) => {
			this.showDeleteModal = false;
			this.alertService.error("" + err);
			this.loading = false;
		});
    } else {
      this.showDeleteModal = false;
      this.alertService.error("Identifiant de l'élément est introuvable !");
      this.loading = false;
    }
  }
	
}

