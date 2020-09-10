import { Component, OnInit } from '@angular/core';
import { GroupService } from '../services/group.service';
import { UserService } from "../services/user.service";
import { AuthenticationService } from '../services/authentication.service';
import { User } from '../models/user.model';
import { UploadEvent, FileSystemFileEntry } from 'ngx-file-drop';
import { Metadata } from '../models/metadata.model';
import * as URL from '../app-url';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AlertService } from '../services/alert.service';
import { Category } from '../models/category.model';
import { CategoryService } from '../services/category.service';
import * as CONST from '../app-const';

@Component({
  selector: 'app-versement',
  templateUrl: './versement.component.html',
  styleUrls: ['./versement.component.scss']
})
export class VersementComponent implements OnInit {

  groups: any[] = [];
	metadatas: Metadata[] = [];
	users: any[] = [];
	interests: any[] = [];
	user: User;
	
	files: MyFile[] = [];

  //form fields
  name: string;
	categoryId: string;
	categories: Category[] = [];
  groupIds: number[] = [];
  groupNames: string[] = [];
  metadataFormValues: string[] = [];

  //for modal
  display = 'none';

  tmpEvent: UploadEvent;

  //for progress bar
  processing: boolean = false;
	progressionPercent: number;
	
	//for multiple group select
	selectedGoups: any[] = [];
	dropdownSettings = {};

	//for multiple users select
	selectedUsers: any[] = [];
	dropdownSettings2 = {};

  constructor(
		private http: HttpClient,
		private categoryService: CategoryService,
    private alertService: AlertService,
    private userService: UserService,
    private groupService: GroupService,
		private authService: AuthenticationService) 
		{ 
			this.userService.list().subscribe(data => {
				data.forEach((u,i) => {
					if(u.login != 'public' && u.id != this.authService.getUser().id){
						let user: any = u;
						user.name = user.firstName + ' ' + user.lastName;
						this.users.push(user);
						this.interests.push(user);
					}
				});
				this.interests = [...this.interests];
			});
			this.categoryService.getCategories().subscribe(data => {
				this.categories = data;
			});

			this.groupService.userGroups().subscribe( data => {
				this.groups = data;
			});

		}

  async ngOnInit() {
		this.user = this.authService.getUser();
		
    this.metadatas.forEach((m: Metadata) => {
      this.metadataFormValues[m.name] = '';
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
			allowSearchFilter: true,
			searchPlaceholderText: 'Rechercher parmis les utilisateurs restant',
			noDataAvailablePlaceholderText: 'Il ne reste aucun utilisateur'
		};
  }


  public dropped(event: UploadEvent) {
    this.tmpEvent = event;
    for (const droppedFile of event.files) {
      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        let path = droppedFile.relativePath;
        let alreadyExist = false;
        this.files.forEach((f: MyFile) => {
          if (f.path === path) {
            alreadyExist = true;
          }
        });
        if (alreadyExist) {
          return alert('Ce fichier existe déjà !');
				}
				let settingValidFileType = sessionStorage.getItem(CONST.VALID_FILE_TYPES);
				if (!settingValidFileType){
					settingValidFileType = "pdf";
				}
				let validFileTypes = settingValidFileType.split(',');
				let fileExtension = path.toLowerCase().split(".")[
					path.toLowerCase().split(".").length-1];
        if(!validFileTypes.filter(element => element == fileExtension)[0]){
          return alert(
						"Ce fichier n'est pas sous un format valide (" +
							sessionStorage.getItem(CONST.VALID_FILE_TYPES) +
						")"
					);
				}
				this.name = fileEntry.name.replace(/\.[^/.]+$/, "");
				this.categoryId = '';
      }else{
        return alert("Votre sélection n'est pas un fichier");
      }
		}
    this.openModal();
  }

  computeInput() {

    //this.files = [];

    let event: UploadEvent = this.tmpEvent;

    if(!event)
      return;

    for (const droppedFile of event.files) {
			// Is it a file?
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
				let item = new MyFile();
				fileEntry.file((file: File) => {
          item.blob = file;
					item.path = droppedFile.relativePath;
					item.ext = item.path.toLowerCase().split(".")[
						item.path.toLowerCase().split(".").length - 1
					];
					item.name = this.name;
					item.categoryId = +this.categoryId;

					this.selectedGoups.forEach( g => {
						item.groups.push(g.name);
						item.groupIds.push(g.id);
					});
					this.selectedGoups = [];

					this.selectedUsers.forEach( u => {
						item.interests.push(u.id);
					});
					this.selectedUsers = [];
					
					item.size = Math.round(file.size / 1024) + ' Ko';
          let date = new Date(file.lastModified)
          item.lastModified =
                              this.format(date.getDay()) + '/' +
                              this.format(date.getMonth()) + '/' +
                              date.getFullYear() + '  ' +
                              this.format(date.getHours()) + ':' +
                              this.format(date.getMinutes()) + ':' +
                              this.format(date.getSeconds());
					this.name = '';
					this.categoryId = '';
				});
				this.metadatas.forEach((m: Metadata) => {
					item.metadatas.push({
						name: m.name,
						val: this.metadataFormValues[m.name]
					});
					this.metadataFormValues[m.name] = "";
				});
				this.files.push(item);
				//console.log(item);
			}
		}
		event.files = [];
		this.metadatas = [];
  }

  public fileOver(event) {
    //console.log(event);
  }

  public fileLeave(event) {
    //console.log(event);
  }


  private format(value: number): string {
    if (value < 10)
      return '0' + value;
    return value+'';
  }

  updateMetadataValues(value, name) {
    this.metadataFormValues[name] = value;
  }

	onNameChanged(newName) {
		this.name = newName;
	}

	onCategoryChanged(d){
		this.categoryId = d;
		this.metadatas = [];
		let id = +this.categoryId;
		let cat: Category = this.categories.find( (val) => {
			return val.id == id;
		});
		this.metadatas = cat.metadatas; 
		//this.selectedGoups = cat.groups;
		this.groupService.categoryGroups(cat.id).subscribe(data => this.selectedGoups = data);
	}

  openModal() {
    this.display = 'block';
  }

  onCloseHandled() {
    this.display = 'none';
  }

  onModalSaveButtonPressed() {
    this.display = 'none';
    this.computeInput();
	}
	
	refreshInterestList(groups) {
		//reset interests to all user before filtring
		this.interests = [...this.users];

		//we remove user belong to selected groups
		let that = this;
		groups.forEach( g0 => {
			let g = that.groups.find(val => {return val.id === g0.id});
			if (that.interests.length > 0){
				for (const u1 of g.users) {
					that.interests.forEach( (u2,i) => {
						if(u1.id === u2.id){
							that.interests.splice(i, 1);
						}
					});
				}
			}
		});

		//if user is not in array of interest, we remove it
		this.selectedUsers.forEach((u1,i) => {
			let b = false;
			that.interests.forEach(u2 => {
				b = b || u1.id === u2.id;
			});
			if(!b)
				that.selectedUsers.splice(i,1);
		});

		this.interests = [...this.interests];
		this.selectedUsers = [...this.selectedUsers];
	}


	onItemSelect(item: any) {
		this.refreshInterestList(this.selectedGoups);
	}

	onItemDeSelect(item: any) {
		this.refreshInterestList(this.selectedGoups);
	}

	onDeSelectAll(event: any) {
		this.refreshInterestList([]);
	}

	onSelectAll(event: any) {
		this.refreshInterestList(this.groups);
	}

	onItemSelect2(item: any) {
	}

	onItemDeSelect2(item: any) {
	}

	onDeSelectAll2(event: any) {
	}

	onSelectAll2(event: any) {
	}

  delFile(path){
    let item: MyFile;
    this.files.forEach((f: MyFile, index: number) => {
      if (f.path === path) {
        this.files.splice(index,1);
      }
    });
  }





  //The main work of the component
  async uploadFiles() {

		let cte = await this.authService.hasPrivilege(12);
		if(!cte){
			return;
		}
		this.processing = true;
		let progression = 0;
		let total = this.files.length;
		this.progressionPercent = 0;
		let success = 0;

		this.files.forEach( (file:MyFile, i:number) => {
			this.uploadFile(file)
				.then((data) => {
					success++;
					this.alertService.success('versement de ' + file.name + ' éffectué avec succès !');
					this.delFile(file.path);
				})
				.catch((err: HttpErrorResponse) => this.alertService.error("Erreur lors de l'envoie de " + file.name + " : " + err))
				.finally( () => {
					progression++;
					this.progressionPercent = (progression / total) * 100;
					if(progression == total){
						this.processing = false;
						if(success == total && total > 1)
							this.alertService.success("Tout les fichiers ont été uploader avec succès !");
					}
				});
		});

			
		this.files = [];
  }


  async uploadFile(file: MyFile): Promise<any>{
		
		//console.log(file);
		const formData = new FormData();
		formData.append('name', file.name);
		formData.append('categoryId', ''+file.categoryId);
		formData.append('groupIds', JSON.stringify(file.groupIds));
		formData.append('interests', JSON.stringify(file.interests));
		file.metadatas.forEach((m: { name: string, val: string }) => {
			formData.append(m.name, m.val);
		});

		formData.append("file", file.blob, file.path);
		return this.http.post(URL.POST_ARCHIVE, formData).toPromise();

  }

}



export class MyFile {
  name: string;
	categoryId: number;
	path: string;
	ext: string;
  size: string;
  lastModified: string;
  groupIds: number[] = [];
  interests: number[] = [];
  groups: string[] = [];
  metadatas: {name:string, val:string}[] = [];
	blob: File;
}
