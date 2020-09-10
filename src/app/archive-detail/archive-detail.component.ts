import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ArchiveService } from '../services/archive.service';
import { Utils } from '../app-utils';
import { MetadataService } from '../services/metadata.service';
import { Metadata } from '../models/metadata.model';
import { SharingService } from '../services/sharing.service';
import { AuthenticationService } from '../services/authentication.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-archive-detail',
  templateUrl: './archive-detail.component.html',
  styleUrls: ['./archive-detail.component.scss']
})
export class ArchiveDetailComponent implements OnInit, OnDestroy {

  private sub: Subscription;
  private archive: any;
  private metadatas: Metadata[] = [];
	isLoading: boolean = true;
	
	canDelete = false;
	canDownload = false;
	canRestore = false;

  constructor(
    private route: ActivatedRoute,
		private router: Router,
		private authService: AuthenticationService,
    private sharingService: SharingService,
    private archiveService: ArchiveService,
    private metadataService: MetadataService) { 
			this.metadataService.all().subscribe(data => {
				this.metadatas = data;
			});
		}

  ngOnInit() {
		this.isLoading = true;
    this.sub = this.route.params.subscribe( params => {
      let id = +params['id']; // (+) converts string 'id' to a number
      this.archiveService.getById(id).toPromise()
      .then( data => {
        this.archive = data;
        console.log(data)
        this.setUpArchive();
      })
      .catch(err => {
        this.router.navigate(['not-found']);
      })
      .finally(() => {
        this.isLoading = false;
      });
    });


		this.authService.hasPrivilege(13).then(bool => {
			this.canDownload = bool;
		});

		this.authService.hasPrivilege(15).then(bool => {
			this.canDelete = bool;
		});

		this.authService.hasPrivilege(16).then(bool => {
			this.canRestore = bool;
		});
  }


  ngOnDestroy() {
    this.sub.unsubscribe();
  }


  async setUpArchive() {
    this.archive.size = Utils.getReadableFileSizeString(this.archive.size);
		this.archive.categorie = this.archive.category.name;
		this.archive.deletedAt = '';
		this.archiveService.getDeletedAt(this.archive.id).toPromise()
			.then( (data:any) => {
				let date = data.deletedAt;
				if(date)
					this.archive.deletedAt = date;
			});
    this.archive.details = [];
    let metadataValues = await this.metadataService.getMetadataValues(this.archive.id).toPromise();
    metadataValues.forEach(mv => {
      this.archive.details[mv.metadata.name] = mv.value;
		});
  }



  download() {
    this.archiveService.download(this.archive, this.archive.name + '.pdf');
  }


  delete() {
		this.archiveService.delete(this.archive.id).subscribe(() => this.ngOnInit());
  }


  restore() {
		this.archiveService.restore(this.archive.id).subscribe(() => this.ngOnInit());
  }

  goToGroup(group) {
    this.sharingService.setData(group);
    this.router.navigate(['/group']);
	}
	
	goToCategory() {
		this.sharingService.setData(this.archive.category);
		this.router.navigate(['/category']);
	}

}
