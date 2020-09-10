import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class DataTableFilterService {
  constructor() {}

  public data: any;

  search(term: string, dataInit: any): any {
    if (!term) {
      this.data = dataInit;
    } else {
      this.data = dataInit.filter(x =>
        x.name
          .trim()
          .toLowerCase()
          .includes(term.trim().toLowerCase())
      );
    }
    return this.data;
  }
}
