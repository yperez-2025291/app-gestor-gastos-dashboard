import { Component, Input } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';

export interface GastoItem {
  id: string;
  concepto: string;
  categoria: string;
  fecha: string;
  monto: number;
}

@Component({
  selector: 'app-expense-table',
  standalone: true,
  imports: [CommonModule, CurrencyPipe],
  templateUrl: './expense-table.component.html',
  styleUrl: './expense-table.component.css'
})
export class ExpenseTableComponent {
  @Input() gastos: GastoItem[] = [];
}