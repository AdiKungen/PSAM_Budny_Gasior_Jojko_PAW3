import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  registerData = {
    imie: '',
    nazwisko: '',
    login: '',
    haslo: ''
  };

  constructor(private authService: AuthService, private router: Router) { }

  register() {
    this.authService.register(this.registerData).subscribe(
      res => {
        alert('Rejestracja pomyślna');
        this.router.navigate(['/']);
      },
      err => {
        alert('Błąd rejestracji');
      }
    );
  }

}