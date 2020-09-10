import { Injectable } from '@angular/core';
import { NotifierService } from 'angular-notifier';

@Injectable()
export class AlertService {
	private notifier: NotifierService;

	constructor(notifierService: NotifierService) {
		this.notifier = notifierService;
	}

	public showNotification(type: string, message: string): void {
		this.playAudio();
		this.notifier.notify(type, type + ": " + message);
	}

	public info(message: string): void {
		this.playAudio();
		this.notifier.notify("info", "Info" + ": " + message);
	}

	public warning(message: string): void {
		this.playAudio();
		this.notifier.notify("warning", "Avertissement" + ": " + message);
  }
  
	public error(message: string): void {
		this.playAudio();
		this.notifier.notify("error", "Erreur" + ": " + message);
  }
  
	public success(message: string): void {
		this.playAudio();
		this.notifier.notify("success", "Succès" + ": " + message);
	}

	private playAudio() {
		let audio = new Audio();
		audio.src = "assets/audios/pop.m4a";
		audio.load();
		audio.play();
	}
}
