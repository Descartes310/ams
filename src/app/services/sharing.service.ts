import { Injectable } from '@angular/core';
import * as CONST from '../app-const';

@Injectable({
  providedIn: 'root'
})
export class SharingService {

  constructor() { }


  public setData(data): void {
    sessionStorage.setItem(CONST.TRANSFERT_DATA, JSON.stringify(data));
  }


  public getData<T>(): T {
    let data: T = JSON.parse(sessionStorage.getItem(CONST.TRANSFERT_DATA));
    sessionStorage.removeItem(CONST.TRANSFERT_DATA);
    return data;
  }
}
