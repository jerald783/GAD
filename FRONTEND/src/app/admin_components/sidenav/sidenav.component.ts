import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidenav',
  standalone: false,
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss'
})
export class SidenavComponent implements OnInit{
  picture: string | null = null;
  email: string | null = null;
  fullName: string | null = null;
  username: string | null = '';
  constructor( private router: Router){

  }
  ngOnInit() {
    this.loadProfile()
    this.username = localStorage.getItem('username');
  }
  opened = false;
  isMasterFileMenuOpen = false;

  toggleMasterFileMenu() {
    this.isMasterFileMenuOpen = !this.isMasterFileMenuOpen;
    
  }
  logOut(){
    localStorage.clear();
    this.router.navigate(['admin-login'])
  }
 
  loadProfile() {
    this.picture = localStorage.getItem('picture');
  }
  
}