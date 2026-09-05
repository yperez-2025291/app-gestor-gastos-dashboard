import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface TaxPayload {
  id?: string;
  name: string;
  type: string;
  value: number;
  appliesTo: string;
  active: boolean;
}

export interface BudgetPayload {
  userId: string;
  fixedSalary?: number;
  invoicedIncome?: number;
  monthlyIncome?: number;
  additionalIncome?: number;
  month?: number;
  year?: number;
  taxes?: TaxPayload[];
}

export interface ApiResponse<T = any> {
  success?: boolean;
  data?: T;
  message?: string;
}

@Injectable({
  providedIn: 'root',
})
export class BudgetService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/budgets`;

  // Estado reactivo global del presupuesto
  private budgetSubject = new BehaviorSubject<any>(null);
  public budget$ = this.budgetSubject.asObservable();

  getBudget(userId: string, month: number, year: number): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/user/${userId}?month=${month}&year=${year}`).pipe(
      tap((res: any) => {
        if (res?.data) {
          this.budgetSubject.next(res.data);
        }
      })
    );
  }

  getBudgetByUserId(userId: string): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/user/${userId}`).pipe(
      tap((res: any) => {
        if (res?.data) {
          this.budgetSubject.next(res.data);
        }
      })
    );
  }

  saveBudget(payload: BudgetPayload): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(this.apiUrl, payload).pipe(
      tap((res: any) => {
        if (res?.data) {
          this.budgetSubject.next(res.data);
        }
      })
    );
  }

  updateLocalBudget(data: any): void {
    this.budgetSubject.next(data);
  }
}