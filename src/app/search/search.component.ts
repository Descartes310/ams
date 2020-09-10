import { Component, OnInit, ViewChild } from '@angular/core';
import { ArchiveService } from '../services/archive.service';
import { MetadataService } from '../services/metadata.service';
import { Group } from '../models/group.model';
import { Metadata } from '../models/metadata.model';
import { User } from '../models/user.model';
import { Category } from '../models/category.model';
import { NgForm } from '@angular/forms';
import { GroupService } from '../services/group.service';
import { Utils } from '../app-utils';
import { Router } from '@angular/router';
import { SharingService } from '../services/sharing.service';
import { CategoryService } from '../services/category.service';
import { Archive } from '../models/archive.model';
import { AlertService } from '../services/alert.service';
import { Observable} from 'rxjs';
import { Subject } from 'rxjs';
import {debounceTime, startWith} from 'rxjs/operators';
import { distinctUntilChanged } from 'rxjs/operators';
import { switchMap } from 'rxjs/operators';
import {pipe} from 'rxjs';
//import {Observable} from 'rxjs/Rx'
import { of } from 'rxjs';
//import  { throw } from 'rxjs';
//import { do } from 'rxjs';
//import 'rxjs/add/operator/filter';
import * as Rx from 'rxjs';
import { catchError} from 'rxjs/operators';
//import { of } from 'rxjs/add/observable/of';
import { combineLatest } from 'rxjs';
//import 'rxjs/add/observable/of';


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
	styleUrls: ['./search.component.scss'],
	providers: [ ArchiveService ],
})
export class SearchComponent implements OnInit {

  user: User;
	metadatas: Metadata[] = [];
	metadatas_tmp:Metadata[] = [];
  archives: any[] = [];
  archives_tmp: any[] = [];
  isResult: boolean = false;
  isLoading: boolean = false;
 // private searchTerms = new Subject();
	arch: Observable<string| any[]>;
	archive: Archive[] = [];
	public keyword="name"; 
	id_A: any[]=[];
	id_M: any[]=[];
	id:number;
	//a: String;
	//ob$: Observable<Archive>;


  archiveToDel: any = {name:'', id:0};

	static SESSION_SELECTION = 'SearchComponent.selectedGoups';
	static SESSION_SELECTION2 = 'SearchComponent.selectedCategories';
  //for group handling
  dropdownList = [];
  groups: Group[] = [];
  selectedGoups: Group[] = [];
  dropdownSettings = {};
  groupFilter = '';
	resultGroups: Group[] = [];
	
	//category
	selectedCategories: Category[] = [];
	categories: any[] = [];
	dropdownSettings2 = {};

  //checkbox
  allChecked = false;
  delNum: number = 0;

  //datatable
  numberRowsOnPage = 5;

  //for modal
  displayDM: boolean = false;
  displayDS: boolean = false;


  constructor(
		private router: Router,
		private sharingService: SharingService,
    private groupService: GroupService,
    private archiveService: ArchiveService,
		private metadataService: MetadataService,
		private categoryService: CategoryService,
		private alertService: AlertService) { }

  async ngOnInit() {
		
		this.metadataService.all().toPromise().then(data => {
			 this.metadatas = data;
		});

		//this.archiveService.search
		
		this.groupService.userGroups(true).toPromise().then( data => {
			this.groups = data;
		});
		
		this.categoryService.getCategories(true).toPromise().then( data => {
			this.categories = data;
		});

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Cocher tout',
      unSelectAllText: 'Décocher tout',
      allowSearchFilter: (this.groups.length > 10),
      searchPlaceholderText: 'Rechercher',
      noDataAvailablePlaceholderText: 'Aucun groupe trouvé'
		};
		
		this.dropdownSettings2 = {
			singleSelection: false,
			idField: 'id',
			textField: 'name',
			selectAllText: 'Cocher tout',
			unSelectAllText: 'Décocher tout',
			allowSearchFilter: (this.categories.length > 10),
			searchPlaceholderText: 'Rechercher',
			noDataAvailablePlaceholderText: 'Aucune catégorie trouvé'
		};
		
		this.storeSelectionToSession();

		this.loadArchives();

	}

	loadArchives() {
		this.isLoading = true;
    this.archiveService.search(null).toPromise()
    .then( data => {
      this.archives = data;
			this.setUpArchives();
			console.log('ARCHIVES: ', data);
		})
		.catch(err => this.alertService.error(err))
    .finally( () => {
      this.isLoading = false;
      this.isResult = true;
		});
	}



  doFilter(value:Archive, index, array): boolean {
		let result1 = false;
		let result2 = false;

		let selectedGoups = JSON.parse(sessionStorage.getItem(SearchComponent.SESSION_SELECTION));
		if (!selectedGoups || selectedGoups.length === 0)
      result1 = true;

		if(!result1){
			value.groups.forEach(g1 => {
				selectedGoups.forEach(g2 => {
					if(g1.id === g2.id){
						result1 = true;
					}
				});
			});
		}

		let selectedCategories = JSON.parse(sessionStorage.getItem(SearchComponent.SESSION_SELECTION2));
		if (!selectedCategories || selectedCategories.length === 0)
			result2 =  true;

		if(!result2){
			selectedCategories.forEach(c => {
				if (value.category.id === c.id) {
					result2 = true;
				}
			});
		}

		return result1 && result2;
  }

  storeSelectionToSession(){
    sessionStorage.setItem(SearchComponent.SESSION_SELECTION, JSON.stringify(this.selectedGoups));
    sessionStorage.setItem(SearchComponent.SESSION_SELECTION2, JSON.stringify(this.selectedCategories));
  }

  onItemSelect(item: any) {
    this.storeSelectionToSession();
  }

  onItemDeSelect(item: any){
    this.storeSelectionToSession();
  }

  onDeSelectAll(item: any) {
    this.storeSelectionToSession();
  }

  onSelectAll(items: any) {
    this.storeSelectionToSession();
  }

  openDeleteModal() {
    this.displayDM = true;
  }

  openDeleteCheckedModal(){
    this.displayDS = this.delNum > 0;
  }

  onCloseHandled() {
    this.displayDM = this.displayDS = false;
  }


  checkAll(){
    let list = document.getElementsByClassName('selection-checkbox');
    this.allChecked = !this.allChecked ;
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
      this.delNum += elt.checked ? 1: 0;
    }
  }

  async setUpArchives() {
    this.archives.forEach(async (a) => {
      a.size = Utils.getReadableFileSizeString(a.size);
			a.categorie = a.category.name;
		});
		console.log(this.archives);
		this.archives_tmp = this.archives;
  }


  searchName(name: string) {
		this.isLoading = true;
		this.archives = this.archives_tmp;
		console.log('FORM VALUE: ', name)
    console.log(this.archives[0].name, this.archives_tmp);
		if(name.length > 0) {
      this.archives = this.archives.filter(a => {
        return a.name.toString().toLowerCase().includes(name.toString().toLowerCase())
      });
				//console.log(a.name.toString().toLowerCase().includes(name.toString().toLowerCase()));
			
		}
		this.isLoading = false;
	}
	
	searchMeta(name_meta: Metadata[]) {
		this.isLoading = true;
		this.archives = this.archives_tmp;
		//console.log(this.archives.name)
		this.metadatas_tmp = this.metadatas;
		console.log('FORM VALUE: ', name_meta)
    console.log(this.metadatas_tmp[0].name, this.metadatas);
		if(name_meta.length > 0) {
			this.id_A = this.archives.filter(a => { return a.id} );
			console.log(this.id_A);
			this.id_M = this.metadatas.filter( m => {return m.id});
			console.log(this.id_M);
			for(let i=0; i<= this.id_A.length; i++)
			{
				for(let j=0; j<= this.id_M.length; j++)
				{
					if(this.id_A[i] == this.id_M[j]){
                  this.archives = this.archives.filter(a => {
        return a.name.toString().toLowerCase().includes(name_meta.toString().toLowerCase())
      });
					}
				}
			}

				//console.log(a.name.toString().toLowerCase().includes(name.toString().toLowerCase()));
			
		}
		this.isLoading = false;
  }


  download(archive){
    this.archiveService.download(archive, archive.name + '.pdf');
  }


  deleteConfirm(archive){
    this.archiveToDel = archive;
    this.openDeleteModal();
  }

  delete(archiveId:number){
    this.archives.forEach( (a,i) => {
      if(a.id == archiveId){
        this.archives.splice(i, 1);
      }
    });

    this.archiveService.delete(archiveId).subscribe(
      () => {
        this.archiveToDel =  {name:'', id:0};
      }
    );

    this.onCloseHandled();
    this.checkItemCliked();
  }

  downloadChecked(){
    let list = document.getElementsByClassName('selection-checkbox');
    for (let i = 0; i < list.length; i++) {
      let elt = (<HTMLInputElement>list[i]);
      if (elt.checked) {
        let eltId = parseInt(elt.name);
        this.archives.forEach( a => {
          if (a.id == eltId) {
            this.download(a);
          }
        });
      }
    }

  }


  deleteChecked(){
    let list = document.getElementsByClassName('selection-checkbox');
    for (let i = 0; i < list.length; i++) {
      let elt = (<HTMLInputElement>list[i]);
      if(elt.checked){
        let delId = parseInt(elt.name);
        this.archives.forEach((a, i) => {
          if (a.id == delId) {
            this.archiveService.delete(a.id).subscribe();
            this.archives.splice(i, 1);
          }
        });
      }
    }

    this.onCloseHandled();
    this.checkItemCliked();
	}
	


	goToCategory(category){
		this.sharingService.setData(category);
		this.router.navigate(['/category']);
	}

	recherche = ""
  
  setName(value){
		/*if(value.startsWith(value[1])){
        alert("le mot commence par:"); 
		}*/
		this.recherche = value;
		
  }

}
