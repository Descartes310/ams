import { Component, OnInit } from '@angular/core';
import { Group } from '../models/group.model';
import { SharingService } from "../services/sharing.service";
import { ArchiveService } from '../services/archive.service';
import { AuthenticationService } from '../services/authentication.service';
import { MetadataService } from '../services/metadata.service';
import { Utils } from '../app-utils';
import { CategoryService } from '../services/category.service';
import { Category } from '../models/category.model';
import { AlertService } from '../services/alert.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss']
})
export class GroupComponent implements OnInit {

  group: Group;
  archiveFilter: any = { name: '', categorie: '', date: '', size: '', archivistName:''}
  archives: any[] = [];
  allCategories: string[] = [];
	private static GROUP_SESSION_NAME: string = 'current_group';
	
	canDownload = false;
	canDelete = false;

	//used by view
	p;
	
  constructor(
		private router: Router,
    private sharingService: SharingService,
		private archiveService: ArchiveService,
		private categoryService: CategoryService,
		private metadataService: MetadataService,
		private alertService: AlertService,
    private authService: AuthenticationService) { }

  async ngOnInit() {

		this.authService.hasPrivilege(13).then(bool => {
			this.canDownload = bool;
		});

		this.authService.hasPrivilege(15).then(bool => {
			this.canDelete = bool;
		});

		this.group = this.sharingService.getData<Group>();
		
		if(this.group == null){
			this.group = new Group();
			this.group.id = 0;
			this.group.name = 'Tout les groupes';
			this.group.description = 'Une fusion de tout les groupes';
		}
		
		this.categoryService.getCategories(true).toPromise()
			.then((data:Category[]) => { 
				data.forEach( category => {
					this.allCategories.push(category.name);
				});
			})
			.catch( err => this.alertService.error("Une erreur est survenue lors du retrait des données"));

    if(this.group){
      sessionStorage.setItem(GroupComponent.GROUP_SESSION_NAME, JSON.stringify(this.group));
    }else{
      this.group = JSON.parse(sessionStorage.getItem(GroupComponent.GROUP_SESSION_NAME));
    }

    if(!this.group){
      this.group = new Group();
      this.group.id = 0;
      this.group.name = 'Tout les groupes';
      this.group.description = 'Une fusion de tout les groupes';
    }

    if (this.group.id > 0)
      this.archives = await this.archiveService.allOfGroup(this.group.id).toPromise();
    else
      this.archives = await this.archiveService.allOfUser().toPromise();

    this.setUpArchives();
  }



  private async setUpArchives(){
    this.archives.forEach( async (a, i) => {
      a.size = Utils.getReadableFileSizeString(a.size);
			a.date = new Date(a.createdAt).toLocaleDateString();
			a.categorie = a.category.name;
      let metadataValues = await this.metadataService.getMetadataValues(a.id).toPromise();
      metadataValues.forEach(mv => {
          let name = mv.metadata.name, val = mv.value;
          a[name] = val;
      });
    });
  }


  onDateFilterChange(val){
    if (val !== null && val !== undefined && val !== '') {
      let d = new Date(val);
      this.archiveFilter.date = d.toLocaleDateString();
    }else{
      this.archiveFilter.date = '';
    }
  }


  download(archive) {
    this.archiveService.download(archive, archive.name + '.pdf');
  }


  delete(archive) {
    this.archiveService.delete(archive.id).subscribe(
      () => {
        this.archives.forEach( (a,i) => {
          if(a.id === archive.id){
            this.archives.splice(i,1);
          }
        });
    });
	}
	

	toCategory(category) {
		this.sharingService.setData(category);
		this.router.navigate(['/category']);
	}

}
