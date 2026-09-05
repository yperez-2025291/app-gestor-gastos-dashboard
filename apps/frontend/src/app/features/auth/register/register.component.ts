import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service'; // Inyectar servicio

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  fullName: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  acceptTerms: boolean = false;
  isLoading: boolean = false;

  private authService = inject(AuthService);
  private router = inject(Router);

  onRegister(): void {
    if (!this.fullName || !this.email || !this.password) {
      alert('Por favor completa todos los campos');
      return;
    }

    if (this.password !== this.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    if (!this.acceptTerms) {
      alert('Debes aceptar los términos y condiciones');
      return;
    }

    this.isLoading = true;

    // Conexión con el Backend vía HTTP POST
    this.authService.register({
      name: this.fullName,
      email: this.email,
      password: this.password
    }).subscribe({
      next: () => {
        this.isLoading = false;
        alert('¡Usuario registrado exitosamente!');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error al registrar usuario:', err);
        alert(err.error?.message || 'Error al intentar registrar el usuario');
      }
    });
  }
}