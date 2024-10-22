import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  loginData = {
    login: '',
    haslo: ''
  };

  constructor(private authService: AuthService, private router: Router) { }

  login() {
    this.authService.login(this.loginData).subscribe(
      res => {
        localStorage.setItem('token', res.token);
        this.router.navigate(['/courses']);
      },
      err => {
        alert('Nieprawidłowy login lub hasło');
      }
    );
  }

}