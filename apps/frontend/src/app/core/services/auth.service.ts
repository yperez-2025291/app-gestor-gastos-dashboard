import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TokenStorageService } from './token-storage.service';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  data: {
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
    };
    token: string;
  };
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  message: string;
  data: {
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private tokenStorage = inject(TokenStorageService);
  private apiUrl = `${environment.apiUrl}/users`;

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response: any) => {
        // Extrae el token independientemente de la envolvente del backend
        const token = response.data?.token || response.token;
        if (token) {
          this.tokenStorage.saveToken(token);
        }

        // Extrae la entidad del usuario para persistir la sesión
        const user = response.data?.user || response.user || response.data;
        if (user && typeof user === 'object') {
          this.tokenStorage.saveUser(user);
        }
      })
    );
  }

  register(credentials: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.apiUrl}/register`, credentials);
  }

  refreshToken(): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/refresh-token`, {}).pipe(
      tap((response: any) => {
        const token = response.data?.token || response.token;
        if (token) {
          this.tokenStorage.saveToken(token);
        }
        const user = response.data?.user || response.user || response.data;
        if (user && typeof user === 'object') {
          this.tokenStorage.saveUser(user);
        }
      })
    );
  }

  logout(): void {
    this.tokenStorage.clear();
  }

  isLoggedIn(): boolean {
    return !!this.tokenStorage.getToken();
  }
}