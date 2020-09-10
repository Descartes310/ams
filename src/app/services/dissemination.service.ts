import { Injectable } from "@angular/core";
import { Archive } from '../models/archive.model';
import * as URL from '../app-url';
import SockJS from "sockjs-client";
import * as Stomp from "@stomp/stompjs";
import { Subject, PartialObserver, Subscription } from "rxjs";
import { AlertService } from "./alert.service";
import { ArchiveService } from "./archive.service";

@Injectable({
  providedIn: "root"
})
export class DisseminationService {

	private stompClient: Stomp.Client;
	private sub: Subject<Archive>;
	private list: Archive[] = [];

	constructor(
		private alertService: AlertService,
		private archiveSerice: ArchiveService) 
	{
		this.initializeWebSocketConnection();
	}



	private initializeWebSocketConnection() {
	
		this.sub = new Subject();
		this.stompClient = new Stomp.Client();
		/* this.stompClient.debug = function debug(arg) {
			console.log(arg);
		} */

		this.stompClient.webSocketFactory = () => {
			return new SockJS(URL.SOCKET_CONNEXION);
		};

		this.stompClient.activate();
		let that = this;
		let stompHeaders = new Stomp.StompHeaders;
		stompHeaders['Accept'] = 'application/json';
		stompHeaders['withCredentials'] = 'false';
		this.stompClient.onConnect = (frame: Stomp.IFrame) => {
			that.stompClient.subscribe(URL.SOCKET_DESTINATION, (message) => {
				if (message.body) {
					let json = JSON.parse(message.body);
					that.archiveSerice.getById(json.id).toPromise()
					.then( a => that.onReceive(a))
					.catch( err => that.onReceive(json));
				}
			}, stompHeaders);
		};
	}



	private onReceive(a){
		this.sub.next(a);
		this.list.push(a);
		if (!this.sub.observers.length)
			this.alertService.info('Vous avez une nouvelle archive !');
	}

	/* sendMessage(message) {
		this.stompClient.send("/app/send/message", {}, message);
	} */

	public getList(): Archive[]{
		return this.list;
	}


	public clearList(): void{
		this.list = [];
	}

	public subscribe(callback: (a:Archive) => void): Subscription{
		return this.sub.subscribe(callback);
	}



	public destroy(): void{
		if (this.sub)
			this.sub.unsubscribe();

		if (this.stompClient && this.stompClient.active) {
			this.stompClient.deactivate();
		}

		this.stompClient = null;
		this.sub = null;
	}



}
