import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
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
      // Jeśli formularz jest niepoprawny, nie wysyłaj danych
      return;
    }

    // Sprawdzenie, czy hasła się zgadzają
    if (this.registerData.haslo !== this.registerData.confirmHaslo) {
      return;
    }

    // Wyślij dane do serwisu uwierzytelniania
    const { imie, nazwisko, login, haslo } = this.registerData; // Pomijamy confirmHaslo
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
