import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  registerData: {
    imie: string;
    nazwisko: string;
    login: string;
    haslo: string;
    confirmHaslo: string;
  } = {
    imie: '',
    nazwisko: '',
    login: '',
    haslo: '',
    confirmHaslo: '',
  };

  constructor(private authService: AuthService, private router: Router) {}

  register(form: NgForm) {
    if (form.invalid) {
      return;
    }

    if (this.registerData.haslo !== this.registerData.confirmHaslo) {
      return;
    }

    const { imie, nazwisko, login, haslo } = this.registerData;
    this.authService.register({ imie, nazwisko, login, haslo }).subscribe(
      (res) => {
        alert('Rejestracja pomyślna');
        this.router.navigate(['/']);
      },
      (err) => {
        alert('Błąd rejestracji');
      }
    );
  }
}
