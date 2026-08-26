import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { SessionStatusService } from '../services/session-status.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const sessionStatusService = inject(SessionStatusService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // Dispara el modal en la pantalla
        sessionStatusService.notifyExpired();
      }
      return throwError(() => error);
    })
  );
};