import { Component, OnInit, OnDestroy, HostListener, ChangeDetectorRef, NgZone, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { SessionExpiredModalComponent } from '../../shared/components/session-expired-modal/session-expired-modal.component';
import { TokenStorageService } from '../../core/services/token-storage.service';

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

  // Limite de inactividad de 2 minutos (120,000 ms)
  private readonly INACTIVITY_LIMIT_MS = 120000;

  private tokenStorage = inject(TokenStorageService);

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

  // Detectar actividad del usuario (mouse, teclado, clicks) para reiniciar el temporizador
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

    // Obtener el token correcto usando el TokenStorageService (clave 'auth_token')
    const token = this.tokenStorage.getToken();
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    let timeToWait = this.INACTIVITY_LIMIT_MS;

    // Decodificar JWT para obtener expiración real si existe
    try {
      const payloadBase64 = token.split('.')[1];
      if (payloadBase64) {
        const decodedPayload = JSON.parse(atob(payloadBase64));
        if (decodedPayload.exp) {
          const expTime = decodedPayload.exp * 1000;
          const timeRemaining = expTime - Date.now();

          if (timeRemaining > 0 && timeRemaining < this.INACTIVITY_LIMIT_MS) {
            timeToWait = timeRemaining;
          } else if (timeRemaining <= 0) {
            this.triggerModal();
            return;
          }
        }
      }
    } catch (e) {
      // Si ocurre un error al decodificar, mantiene el temporizador predeterminado de 2 min
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
    this.tokenStorage.clear();
    this.router.navigate(['/login']);
  }

  handleCancel(): void {
    this.showSessionModal = false;
    this.tokenStorage.clear();
    this.router.navigate(['/login']);
  }
}