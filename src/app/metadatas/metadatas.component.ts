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
import { Metadata } from '../models/metadata.model';

@Component({
  selector: "app-metadatas",
  templateUrl: "./metadatas.component.html",
  styleUrls: ["./metadatas.component.scss"]
})
export class MetadatasComponent implements OnInit {
  allMetadatas: Metadata[] = [];
  public data: Metadata[] = [];
  idToDelete: number;
  showAddMetaModal = false;
  showDeleteMetaModal = false;
  addMetaForm: FormGroup;
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
    private metadataService: MetadataService
  ) {
    this.alert = alertService;
  }

  get getAddMetaForm() {
    return this.addMetaForm.controls;
  }

  ngOnInit() {
    this.addMetaForm = this.formBuilder.group({
			type: ["", Validators.compose([Validators.required])],
			label: [
				"",
				Validators.compose([
					Validators.required,
					Validators.minLength(3),
					Validators.maxLength(20)
				])
      ],
      name: []
		});
    this.getMetadatas();
  }
  //This function is used to get metadatas
  getMetadatas(): void {
    this.metadataService.getMetadatas().toPromise().then((data: Metadata[]) => {
      this.data = data;
      this.allMetadatas = data;
      this.mainLoading = false;
    })
    .catch((err: HttpErrorResponse) => {
      this.mainLoading = false;
      this.alert.error(""+err);
    });
  }

  //This function is used to add a new metadatas after form submission
  async onSubmit() {
    this.isSubmitted = true;
    if (this.addMetaForm.invalid) {
      this.loading = false;
      return;
    }
    this.loading = true;
    let name = this.getAddMetaForm.label.value.replace(/[^a-zA-Z0-9]/g, '_');
    this.getAddMetaForm.name.setValue(name);
    await this.metadataService.addMetadata(
      this.getAddMetaForm.name.value,
      this.getAddMetaForm.label.value,
      this.getAddMetaForm.type.value,
    )
    .then((data) => {
      this.showAddMetaModal = false;
			this.alertService.success(
				"Nouvelle méta donnée ajoutée avec succès !"
			);
			this.loading = false;
			this.getMetadatas();
    })
    .catch((err: HttpErrorResponse) => {
      this.alertService.error(
				""+err
			);
			this.loading = false;
    });
  }

  //This function is used by dataTable to filter elements
  search(term: string) {
    if (!term) {
      this.data = this.allMetadatas;
    } else {
      this.data = this.allMetadatas.filter(x => x.name
          .trim()
          .toLowerCase()
          .includes(term.trim().toLowerCase()));
    }
  }

  //This function allow us to access to edit metadatas page, its param is a metadatas id
  editMetadata(metadataId: number) {
    this.router.navigate(["/admin/metadatas", metadataId]);
  }

  //This function is used to set metadata id before deleting
  setIdToDetele(metadataId: number) {
    this.showDeleteMetaModal = true;
    this.idToDelete = metadataId;
  }
  //This function is use to delete a metadata
  async deleteMetadata() {
    if (this.idToDelete != null) {
      await this.metadataService.deleteMetadata(
        this.idToDelete
      )
      .then((data) => {
        this.showDeleteMetaModal = false;
				this.alertService.success(
					"Méta donnée supprimée avec succès !"
				);
				this.getMetadatas();
      })
      .catch((err: HttpErrorResponse) => {
        this.showDeleteMetaModal = false;
				this.alertService.error(""+err);
				this.loading = false;
      });
    } else {
      this.showDeleteMetaModal = false;
      this.alertService.error("Identifiant de l'élément introuvable");
      this.loading = false;
    }
  }
}
