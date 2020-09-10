import { Component, OnInit, OnDestroy } from '@angular/core';
import { GroupService } from '../services/group.service';
import { ArchiveService } from '../services/archive.service';
import { Archive } from '../models/archive.model';
import { AlertService } from '../services/alert.service';
import { Group } from '../models/group.model';
import { AuthenticationService } from '../services/authentication.service';
import { DisseminationService } from '../services/dissemination.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-left-side',
  templateUrl: './left-side.component.html',
  styleUrls: ['./left-side.component.scss']
})
export class LeftSideComponent implements OnInit, OnDestroy {

  groups :any[] = [];
	isLoading = true;
	unread: number = 0;

	private static SESSION_GROUPS = 'LeftSideComponent.session.groups';
	private static SESSION_UNREAD = 'LeftSideComponent.session.unread';

	private sub: Subscription;

  constructor(
		private disseminationService: DisseminationService,
		private authService: AuthenticationService,
    private archiveService: ArchiveService
  ) {}

  async ngOnInit() {
		this.sessionRead();
		if (!this.groups || this.groups.length == 0){
			this.groups = this.authService.getUser().groups;
			this.setUpGroup(this.groups);
			this.sessionStore();
		}
		this.isLoading = false;

		//we get new archives and update lastLogout if the logged user is not a visitor
		let list = this.disseminationService.getList();
		list.forEach( a => this.onNewArchive(a,false));
		if(list.length > 0){
			this.authService.updateLastLogout();
		}
		
		//we subscribe to evantually new archives
		this.sub = this.disseminationService.subscribe((archive) => {
			this.onNewArchive(archive);
			this.authService.updateLastLogout();
		});
  }


  ngOnDestroy() {
		if (this.sub) {
			this.sub.unsubscribe();
		}
		this.disseminationService.clearList();
	}
	

	sessionStore(){
		sessionStorage.setItem(LeftSideComponent.SESSION_UNREAD, ''+this.unread);
		sessionStorage.setItem(LeftSideComponent.SESSION_GROUPS, JSON.stringify(this.groups));
	}


	sessionRead(){
		this.unread = +sessionStorage.getItem(LeftSideComponent.SESSION_UNREAD);
		this.groups = JSON.parse(sessionStorage.getItem(LeftSideComponent.SESSION_GROUPS));
	}


  setUpGroup(groups){
			
		if (this.authService.getUser().login != "public") {
			let interests = new Group();
			interests.id = 0;
			interests.name = 'Personnel';
			interests.description = 'Documents qui vous sont particulièrement adressés';
			interests.users = [this.authService.getUser()];
			groups.push(interests);
		}
		groups.forEach( (g) => {
		g.archives = [];
				g.newArchives = [];
				this.unread = 0;
			});
		
		if (this.authService.getUser().login != "public") {
			this.archiveService.getSinceLastLogout().subscribe((data:Archive[]) => {
				data.forEach(a => {
					this.onNewArchive(a, false);	//false to avoid sound
				});
			});
		}
  }



  playAudio() {
    let audio = new Audio();
    audio.src = "assets/audio/beep.mp3";
    audio.load();
		audio.play();
  }



	onNewArchivesViewed(archive){
		this.groups.forEach( group => {
			group.newArchives.forEach( (a,i) => {
				if(a.id === archive.id){
					group.archives.push(a);
					group.newArchives.splice(i, 1);
				}
			});
		});
		
		this.unread--;
		this.sessionStore();
	}


	

	


	onNewArchive(archive:Archive, playAudioEnabled = true){
		let isIntoGroup = false;
		this.groups.forEach((g) => {
			let i = archive.groups.findIndex((group) => {
				return (group.id === g.id);
			});

			if (i >= 0) {
				isIntoGroup = true;
				g.newArchives.push(archive);
			}
		});

		archive.interests.forEach(user => {
			if (user.id === this.authService.getUser().id) {
				this.groups[this.groups.length - 1].newArchives.push(archive);
				isIntoGroup = true;
			}
		})

		if (isIntoGroup) {
			this.unread++;
			if (playAudioEnabled)
				this.playAudio();
		}

		this.sessionStore();
	}
}
