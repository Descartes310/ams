import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { SharingService } from '../services/sharing.service';
import { Category } from '../models/category.model';
import { CategoryService } from '../services/category.service';
import { AlertService } from '../services/alert.service';
import { ArchiveService } from '../services/archive.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

	categories: Array<Category> = [];
	allCategory: Category = new Category();
	interval: any;


  constructor(
    private router: Router,
    private categoryService: CategoryService,
    private archiveService: ArchiveService,
		private sharingService: SharingService,
		private alertService: AlertService) { }

  ngOnInit() {
		
		this.allCategory.id = 0;
		this.allCategory.name = 'Toute les catégories';
		this.allCategory.description = 'Une fusion de toute les catégorie';

    this.getData(false);
		this.interval = setInterval(() => {
      this.getData(true);
    }, 1000*60*5);  //check for new category every five minute
	}


	ngOnDestroy(){
		clearInterval(this.interval);
	}


  getData(hideLog: boolean){
		this.categoryService.getCategories(hideLog).toPromise()
		.then((data: Array<Category>) => {
			if (data.length != this.categories.length) {
				//this.categories = data;
				this.categories = [];
				data.forEach(async categ => {
					let tab = await this.archiveService.allOfCategory(categ.id).toPromise();
					if(tab.length > 0){
						this.categories.push(categ);
					}
				});
			}
		})
		.catch(err => this.alertService.error("Une erreur s'est produite lors du retrait des données"));
  }


	goToCategory(category: Category) {
		this.sharingService.setData(category);
		this.router.navigate(['/category']);
  }

}
