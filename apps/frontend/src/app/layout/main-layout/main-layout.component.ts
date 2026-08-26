import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { SessionExpiredModalComponent } from '../../shared/components/session-expired-modal/session-expired-modal.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, SidebarComponent, SessionExpiredModalComponent],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css'
})
export class MainLayoutComponent implements OnInit, OnDestroy {
  showSessionModal: boolean = false;
  private timer: any;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.checkTokenExpiration();
  }

  ngOnDestroy(): void {
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }

  checkTokenExpiration(): void {
    const token = localStorage.getItem('token');
    
    if (!token) {
      // Si no hay token, enviar al login
      this.router.navigate(['/login']);
      return;
    }

    try {
      // Decodificar el payload del token JWT
      const payloadBase64 = token.split('.')[1];
      const decodedPayload = JSON.parse(atob(payloadBase64));
      
      // Multiplicar exp por 1000 para convertir segundos a milisegundos
      const expTime = decodedPayload.exp * 1000;
      const currentTime = Date.now();
      const timeRemaining = expTime - currentTime;

      if (timeRemaining <= 0) {
        // El token ya expiró
        this.showSessionModal = true;
      } else {
        // Programar el modal para cuando se cumpla el tiempo restante
        this.timer = setTimeout(() => {
          this.showSessionModal = true;
        }, timeRemaining);
      }
    } catch (error) {
      // Si el token es inválido, forzar expiración
      this.showSessionModal = true;
    }
  }

  handleLoginAgain(): void {
    this.showSessionModal = false;
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  handleCancel(): void {
    this.showSessionModal = false;
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}