import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppInitService } from '../app-init.service';

@Injectable({
  providedIn: 'root'
})
export class ReposService {
  constructor(private http: HttpClient, private appInit: AppInitService) {}

  // Computed getter for API base URL
  private get apiRepos(): string {
    return `${this.appInit.apiURL}/api`;
  }

  refreshList() {
    throw new Error('Method not implemented.');
  }

  // Repository methods
  getRepoList(): Observable<any[]> {
    return this.http.get<any>(`${this.apiRepos}/repo`);
  }

  addRepository(val: any) {
    return this.http.post<any>(`${this.apiRepos}/repo`, val);
  }

  updateRepository(val: any) {
    return this.http.put<any>(`${this.apiRepos}/repo`, val);
  }

  deleteRepository(val: any) {
    return this.http.delete<any>(`${this.apiRepos}/repo/${val}`);
  }
}
