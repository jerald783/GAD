import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

import { ThemeService } from '../../../services/them/theme.service';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  isDisabled = false;

  @Output() filterChanged = new EventEmitter<string>();
  isMobileSearchVisible: boolean = false;

  onFilterChange(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();
    this.filterChanged.emit(filterValue);
  }
  picture: string | null = null;
  email: string | null = null;
  Home: any;
  username: string | null = '';
  constructor(
  
    private router: Router,
    private themeService: ThemeService
  ) {}
  // constructor(
  //   private authGoogleService: AuthGoogleService,
  //   private router: Router,
  //   private themeService: ThemeService
  // ) {}
  ngOnInit() {
    this.username = localStorage.getItem('username');
  }

  toggleDark(): void {
    this.themeService.toggleDarkMode();
  }

  toggleMarron(): void {
    this.themeService.toggleMarronMode();
  }
  // showData(){
  //     const data = JSON.stringify(this.authGoogleService.getProfile())
  //     console.log(data);
  //     alert(data)

  // }
  logOut() {
    // this.authGoogleService.logout();
    this.router.navigate(['login']);
  }
  toggleSearch() {
    this.isMobileSearchVisible = !this.isMobileSearchVisible;
  }

}
