import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AldminloginService } from '../../../services/adminServices/adminlogin.service';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-admin-login',
  standalone: false,
  templateUrl: './admin-login.component.html',
  styleUrl: './admin-login.component.scss'
})
export class AdminLoginComponent implements OnInit{
  username: string = '';
  password: string = '';
  loginMessage: string = '';
  showPassword: boolean = false;
  
  constructor(private userService: UserService, private router: Router) {}
  ngOnInit(): void {
    localStorage.clear();
  }

  onLogin(): void {
    console.log("Logging in with:", this.username, this.password);
    this.userService.login(this.username, this.password).subscribe(
      (response) => {
        console.log("Login successful:", response);
        this.loginMessage = 'Login successful!';
        
        // Store the username in localStorage
        localStorage.setItem('username', this.username);
  
        const role = response.role;
        if (role === 'Admin') {
          this.router.navigate(['/admin', { outlets: { secondary: ['dashboard'] } }]);
        } else if (role === 'User') {
          this.router.navigate(['/main']);
        } else {
          this.loginMessage = 'Role not assigned or invalid role.';
        }
      },
      (error) => {
        console.error("Login error:", error);
        this.loginMessage = 'Invalid username or password.';
      }
    );
  }
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
  

}

