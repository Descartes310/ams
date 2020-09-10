import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Group } from '../models/group.model';
import { GroupService } from '../services/group.service';
import { SharingService } from '../services/sharing.service';

@Component({
  selector: 'app-home2',
  templateUrl: './home2.component.html',
  styleUrls: ['./home2.component.scss']
})
export class Home2Component implements OnInit, OnDestroy {

	groups: Array<Group> = [];
	allGroup: Group = new Group();
	interval: any;

	constructor(
		private router: Router,
		private groupService: GroupService,
		private sharingService: SharingService) { }

	ngOnInit() {

		this.allGroup.id = 0;
		this.allGroup.name = 'Tout les groupes';
		this.allGroup.description = 'Une fusion de tout les groupes';

		this.getData(false);
		this.interval = setInterval(() => {
			this.getData(true);
		}, 1000 * 60 * 5);  //check for new group every five minute
	}


	ngOnDestroy() {
		clearInterval(this.interval);
	}

	getData(hideLog:boolean) {
		this.groupService.userGroups(hideLog).subscribe((data: Array<Group>) => {
			if (data.length != this.groups.length) {
				this.groups = data;
			}
		});
	}


	goToGroup(group: Group) {
		this.sharingService.setData(group);
		this.router.navigate(['/group']);
	}

}
