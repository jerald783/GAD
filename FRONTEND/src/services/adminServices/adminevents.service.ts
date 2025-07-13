import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppInitService } from '../app-init.service';

@Injectable({
  providedIn: 'root'
})
export class AdmineventsService {
  constructor(private http: HttpClient, private appInit: AppInitService) {}

  get apiUrlAsset(): string {
    return `${this.appInit.apiURL}/api`;
  }

  get photoUrl(): string {
    return `${this.appInit.apiURL}/api/Assets/Files/`;
  }

  // Repository
  getEventsList(): Observable<any[]> {
    return this.http.get<any>(this.apiUrlAsset + '/Events');
  }

  addEvents(val: any) {
    return this.http.post<any>(this.apiUrlAsset + '/Events', val);
  }

  updateEvents(val: any) {
    return this.http.put<any>(this.apiUrlAsset + '/Events', val);
  }

  deleteEvents(val: any) {
    return this.http.delete<any>(this.apiUrlAsset + '/Events/' + val);
  }

  uploadFile(val: any) {
    return this.http.post(this.apiUrlAsset + '/Events/SaveFile', val);
  }

  refreshList() {
    throw new Error('Method not implemented.');
  }
}
