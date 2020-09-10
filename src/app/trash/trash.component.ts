import { Component, OnInit, ViewChild } from '@angular/core';
import { ArchiveService } from '../services/archive.service';
import { MetadataService } from '../services/metadata.service';
import { Metadata } from '../models/metadata.model';
import { Utils } from '../app-utils';
import { AuthenticationService } from '../services/authentication.service';
import { AlertService } from '../services/alert.service';

declare var $;

@Component({
  selector: 'app-trash',
  templateUrl: './trash.component.html',
  styleUrls: ['./trash.component.scss']
})
export class TrashComponent implements OnInit {

  archives: any[] = [];
  archiveFilter: any = { name: '', categorie: '',  size: '', date:'' }
  metadatas: Metadata[] = [];
  allCategories: string[] = [];
  isLoading: boolean = true;

  //checkbox
  @ViewChild('mf') table;
  allChecked = false;
  delNum: number = 0;

  //datatable
  numberRowsOnPage = 5;
  dtOptions: any;
	dataTable: any;
	
	//for privileges
	canConsult = false;

  constructor(
		private archiveService: ArchiveService,
		private alertService: AlertService,
		private authService: AuthenticationService,
    private metadataService: MetadataService) { }

  async ngOnInit() {
		this.authService.hasPrivilege(11).then(bool => {
			this.canConsult = bool;
		});

		this.archives = await this.archiveService.trashed().toPromise();
    this.metadatas = await this.metadataService.all().toPromise();

    this.dtOptions = {
      dom: 'Bfrtip',
      buttons: [
        'copy', 'csv', 'excel', 'pdf', 'print'
      ]
    };

    this.setUpArchives();
    this.isLoading = false;
  }


  checkAll(){
    let list = document.getElementsByClassName('selection-checkbox');
    this.allChecked = !this.allChecked;
    for (let i = 0; i < list.length; i++) {
      (<HTMLInputElement>list[i]).checked = this.allChecked;
    }
    this.delNum = list.length;
  }


  checkItemCliked(){
    let list = document.getElementsByClassName('selection-checkbox');
    this.allChecked = true;
    this.delNum = 0;
    for (let i = 0; i < list.length; i++) {
      let elt = (<HTMLInputElement>list[i]);
      this.allChecked = this.allChecked && elt.checked;
      this.delNum += elt.checked ? 1 : 0;
    }
  }

  setUpArchives() {
    this.archives.forEach(async (a) => {
      a.size = Utils.getReadableFileSizeString(a.size);
			a.date = '';
			a.categorie = a.category.name;
			this.archiveService.getDeletedAt(a.id).toPromise()
			.then( data => {
				a.date = data['deletedAt'];
			});

      let metadataValues = await this.metadataService.getMetadataValues(a.id).toPromise();
      metadataValues.forEach(mv => {
        let name = mv.metadata.name, val = mv.value;
        a[name] = val;

				let cat = a.categorie;
				if (this.allCategories.indexOf(cat) < 0){
					this.allCategories.push(cat);
					this.allCategories.sort();
				}

      });
    });
  }


  restore(archive) {
    this.archiveService.restore(archive.id).subscribe(
      () => {
        this.archives.forEach((a, i) => {
          if (a.id === archive.id) {
            this.archives.splice(i, 1);
          }
        });
      }
    );
  }


	delete(archive) {
		this.archiveService.deleteHard(archive.id).subscribe(() => {
			this.archives.forEach((a, i) => {
				if (a.id === archive.id) {
					this.archives.splice(i, 1);
				}
			});
			this.alertService.success('L\'archive "'+archive.name+'" à été supprimée avec succès !');
		});
	}

  restoreChecked() {
    let list = document.getElementsByClassName('selection-checkbox');
    for (let i = 0; i < list.length; i++) {
      let elt = (<HTMLInputElement>list[i]);
      if (elt.checked) {
        let eltId = parseInt(elt.name);
        this.archives.forEach(a => {
          if (a.id == eltId) {
            this.restore(a);
          }
        });
      }
    }

  }



	deleteChecked() {
		let list = document.getElementsByClassName('selection-checkbox');
		for (let i = 0; i < list.length; i++) {
			let elt = (<HTMLInputElement>list[i]);
			if (elt.checked) {
				let eltId = parseInt(elt.name);
				this.archives.forEach(a => {
					if (a.id == eltId) {
						this.delete(a);
					}
				});
			}
		}

	}



  onDateFilterChange(val) {
    if (val !== null && val !== undefined && val !== '') {
      let d = new Date(val);
      this.archiveFilter.date = d.toLocaleDateString();
    } else {
      this.archiveFilter.date = '';
    }
  }









}
