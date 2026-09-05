import { Component, inject, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  rememberMe: boolean = false;
  isLoading: boolean = false;

  private authService = inject(AuthService);
  private router = inject(Router);
  private ngZone = inject(NgZone);

  onLogin(event?: Event): void {
    if (event) {
      event.preventDefault();
    }

    if (!this.email || !this.password) {
      return;
    }

    this.isLoading = true;

    this.authService.login({
      email: this.email.trim(),
      password: this.password
    }).subscribe({
      next: () => {
        this.isLoading = false;
        this.ngZone.run(() => {
          this.router.navigate(['/dashboard']);
        });
      },
      error: () => {
        this.isLoading = false;
        alert('Credenciales incorrectas. Por favor verifica tus datos.');
      }
    });
  }

  onGoogleLogin(): void {
    // Método reservado para integración futura
  }
}