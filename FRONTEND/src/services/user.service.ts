import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppInitService } from './app-init.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient, private appInit: AppInitService) {}

  private get apiURL(): string {
    return this.appInit.apiURL;
  }

  private get apiUser(): string {
    return `${this.apiURL}/api/user`;
  }

  private get apiUserPost(): string {
    return `${this.apiURL}/api/Post`;
  }

  // 🔐 Auth
  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUser}/register`, user, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

  getRoles(): Observable<any> {
    return this.http.get(`${this.apiUser}/roles`, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

  login(username: string, password: string): Observable<any> {
    const loginData = { Username: username, Password: password };
    return this.http.post<any>(`${this.apiUser}/login`, loginData);
  }

  setAuthData(token: string, role: string): void {
    localStorage.setItem('authToken', token);
    localStorage.setItem('userRole', role);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('username');
  }

  getUserRole(): string | null {
    return localStorage.getItem('userRole');
  }

  logout(): void {
    localStorage.removeItem('username');
    localStorage.removeItem('userRole');
  }

  // 📮 User Posts
  getUserPost(): Observable<any[]> {
    return this.http.get<any>(this.apiUserPost);
  }

  addUserpost(val: any) {
    return this.http.post<any>(this.apiUserPost, val);
  }
}
