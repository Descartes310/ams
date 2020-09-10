import { Component, OnInit } from "@angular/core";
import { HttpErrorResponse } from "@angular/common/http";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AlertService } from "../services/alert.service";
import { Router, ActivatedRoute } from "@angular/router";
import { StorageService } from "../services/storage.service";
import { Storage } from "../models/storage.model";

@Component({
  selector: "app-storages",
  templateUrl: "./storages.component.html",
  styleUrls: ["./storages.component.scss"]
})
export class StoragesComponent implements OnInit {
  allStorages: Storage[] = [];
  data: Storage[] = [];
  idToDelete: number;
  showAddStorageModal = false;
  showDeleteStorageModal = false;
  addStorageForm: FormGroup;
  loading = false;
  mainLoading = true;
  isSubmitted = false;
  name: string;
  description: string;
  returnUrl: string;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private alertService: AlertService,
    private storageService: StorageService
  ) {}

  get getAddStorageForm() {
    return this.addStorageForm.controls;
  }

  async ngOnInit() {

    this.addStorageForm = this.formBuilder.group({
			name: [
				"",
				Validators.compose([Validators.required, Validators.minLength(3)])
			],
			address: [
				"",
				Validators.compose([
					Validators.required,
					Validators.pattern(
						"^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]).){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$"
					)
				])
			],
			path: [
				"",
				Validators.compose([
					Validators.required,
					Validators.pattern("^(/[a-zA-Z0-9_]+)+/?$")
				])
			],
			type: [""]
		});
    await this.getStorages();
  }

  //This function is used to get all storages
  async getStorages() {
    await this.storageService.getStorages()
    .toPromise()
    .then((data: Storage[]) => {
      this.data = data;
      this.allStorages = data;
      this.mainLoading = false;
    })
    .catch((err: HttpErrorResponse) => {
			this.alertService.error(""+err);
      this.mainLoading = false;
    });
  }

  //This function is used to add a new storage after form submission
  async onSubmit() {
    this.isSubmitted = true;
    if (this.addStorageForm.invalid) {
      this.loading = false;
      return;
    }
    this.loading = true;
    await this.storageService.addStorage(
      this.getAddStorageForm.name.value,
      this.getAddStorageForm.address.value,
      this.getAddStorageForm.path.value,
      this.getAddStorageForm.type.value
    ).then(result => {
      this.showAddStorageModal = false;
			this.alertService.success(
				"Nouvelle entité de stockage ajoutée avec succès !"
			);
      this.loading = false;
			this.getStorages();
    })
    .catch((err: HttpErrorResponse) => {
      this.alertService.error(
				""+err
			);
			this.loading = false;
    });
  }

  //this function is used to activate/desactivate storage
  async active(id: number, status: boolean) {
    await this.storageService.disableStorage(
      id,
      status
    )
    .then((data) => {
        if (status) {
					this.alertService.success(
						"Stockage activé avec succès !"
					);
          this.data.filter(x => x.id === id)[0].status = true;
				} else {
					this.alertService.success(
						"Stockage désactivé avec succès !"
					);
          this.data.filter(x => x.id === id)[0].status = false;
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
    if (!term) {
      this.data = this.allStorages;
    } else {
      this.data = this.allStorages.filter(x => x.name
          .trim()
          .toLowerCase()
          .includes(term.trim().toLowerCase()));
    }
  }

  //This function allow us to access to edit storage page, its param is a storage id
  editStorage(storageId: number) {
    this.router.navigate(["/admin/storages", storageId]);
  }

  //This function is used to set storage id before deleting
  setIdToDetele(storageId: number) {
    this.showDeleteStorageModal = true;
    this.idToDelete = storageId;
  }
}
