import { Component, OnInit, OnDestroy, HostListener, ChangeDetectorRef, NgZone } from '@angular/core';
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

  // (120,000)
  private readonly INACTIVITY_LIMIT_MS = 120000;

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.startInactivityTimer();
  }

  ngOnDestroy(): void {
    this.clearTimer();
  }

  // Detectar actividad del usuario (mouse, teclado, clicks) para reiniciar los 2 minutos
  @HostListener('window:mousemove')
  @HostListener('window:keydown')
  @HostListener('window:click')
  onUserActivity(): void {
    if (!this.showSessionModal) {
      this.startInactivityTimer();
    }
  }

  private startInactivityTimer(): void {
    this.clearTimer();

    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    let timeToWait = this.INACTIVITY_LIMIT_MS;

    // Intentar decodificar el token JWT para obtener exp si existe
    try {
      const payloadBase64 = token.split('.')[1];
      if (payloadBase64) {
        const decodedPayload = JSON.parse(atob(payloadBase64));
        if (decodedPayload.exp) {
          const expTime = decodedPayload.exp * 1000;
          const timeRemaining = expTime - Date.now();

          // Si el token expira antes de los 2 minutos, usamos el tiempo restante del token
          if (timeRemaining > 0 && timeRemaining < this.INACTIVITY_LIMIT_MS) {
            timeToWait = timeRemaining;
          } else if (timeRemaining <= 0) {
            this.triggerModal();
            return;
          }
        }
      }
    } catch (e) {
      // Si el token no es un JWT válido (dummy), se mantiene el temporizador de 2 min por inactividad
    }

    // Programar la apertura del modal al cumplirse el tiempo
    this.timer = setTimeout(() => {
      this.triggerModal();
    }, timeToWait);
  }

  private triggerModal(): void {
    this.ngZone.run(() => {
      this.showSessionModal = true;
      this.cdr.detectChanges();
    });
  }

  private clearTimer(): void {
    if (this.timer) {
      clearTimeout(this.timer);
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