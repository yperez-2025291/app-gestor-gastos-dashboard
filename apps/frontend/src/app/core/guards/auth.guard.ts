import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { TokenStorageService } from '../services/token-storage.service';

export const authGuard: CanActivateFn = () => {
  const tokenStorage = inject(TokenStorageService);
  const router = inject(Router);

  const token = tokenStorage.getToken();

  if (token) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};