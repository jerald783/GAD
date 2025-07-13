// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppInitService } from '../app-init.service';

@Injectable({
  providedIn: 'root'
})
export class AldminloginService {
  constructor(private http: HttpClient, private appInit: AppInitService) {}

  private get apiUrlLogin(): string {
    return `${this.appInit.apiURL}/api/user/login`;
  }

  login(username: string, password: string): Observable<any> {
    const loginData = { Username: username, Password: password };
    return this.http.post<any>(this.apiUrlLogin, loginData);
  }
}
