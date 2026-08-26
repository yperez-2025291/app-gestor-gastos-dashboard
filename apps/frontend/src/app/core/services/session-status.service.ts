import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SessionStatusService {
  private sessionExpiredSubject = new BehaviorSubject<boolean>(false);
  sessionExpired$ = this.sessionExpiredSubject.asObservable();

  notifyExpired(): void {
    this.sessionExpiredSubject.next(true);
  }

  reset(): void {
    this.sessionExpiredSubject.next(false);
  }
}