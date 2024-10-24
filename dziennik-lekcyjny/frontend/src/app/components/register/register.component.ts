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
    haslo: '',
    confirmHaslo: ''
  };

  errorMessage: string = '';
  
  constructor(private authService: AuthService, private router: Router) { }

  register() {
    // Sprawdzenie, czy hasła się zgadzają
    if (this.registerData.haslo !== this.registerData.confirmHaslo) {
      this.errorMessage = 'Hasła nie są identyczne.';
      return;
    }

    // Jeśli hasła się zgadzają, wyczyść komunikat o błędzie
    this.errorMessage = '';

    // Wyślij dane do serwisu uwierzytelniania
    const { imie, nazwisko, login, haslo } = this.registerData; // Pomijamy confirmHaslo
    this.authService.register({ imie, nazwisko, login, haslo }).subscribe(
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