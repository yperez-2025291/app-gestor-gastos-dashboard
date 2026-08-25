import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { CardComponent } from '../../shared/components/card/card.component';

@Component({
  selector: 'app-dev-placeholder',
  standalone: true,
  imports: [CommonModule, ButtonComponent, CardComponent],
  templateUrl: './dev-placeholder.component.html',
  styleUrls: ['./dev-placeholder.component.css']
})
export class DevPlaceholderComponent implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  showSessionModal = false;
  isExtending = false;
  private sessionTimer: any;

  private readonly SESSION_TIMEOUT = 50000; 

  ngOnInit(): void {
    this.startSessionTimer();
  }

  ngOnDestroy(): void {
    this.clearSessionTimer();
  }

  startSessionTimer(): void {
    this.clearSessionTimer();
    this.sessionTimer = setTimeout(() => {
      this.showSessionModal = true;
      this.cdr.detectChanges(); // Forzamos a Angular a pintar el modal en pantalla
    }, this.SESSION_TIMEOUT);
  }

  clearSessionTimer(): void {
    if (this.sessionTimer) {
      clearTimeout(this.sessionTimer);
    }
  }

  extendSession(): void {
    this.isExtending = true;
    this.authService.refreshToken().subscribe({
      next: () => {
        this.isExtending = false;
        this.showSessionModal = false;
        this.startSessionTimer();
        this.cdr.detectChanges();
      },
      error: () => {
        this.isExtending = false;
        this.logout();
      }
    });
  }

  logout(): void {
    this.clearSessionTimer();
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}