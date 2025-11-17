import { inject, Injectable } from '@angular/core';
import { NgFFDoc } from 'ff-doc/angular';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class FFDocService {
  private jsonInitialized = false;
  private jsonUrl = '/assets/example-ffdoc.json';
  private readonly httpClient: HttpClient = inject(HttpClient);

  private ffDoc: NgFFDoc = new NgFFDoc(this.httpClient);

  // this would normally be done in app component but for this polyframework example a service is better
  getFFDoc(): NgFFDoc {
    if (!this.jsonInitialized) {
      this.ffDoc.initialize(this.jsonUrl);
    }
    return this.ffDoc;
  }
}
