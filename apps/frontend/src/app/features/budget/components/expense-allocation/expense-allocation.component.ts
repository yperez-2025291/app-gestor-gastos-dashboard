import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-expense-allocation',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="section-card">
      <h2>Asignación de Presupuesto</h2>
      <p class="placeholder-text">Distribución de gasto diario por categorías.</p>
    </div>
  `,
  styles: [`
    .section-card {
      padding: 10px;
    }
    h2 {
      font-size: 1.2rem;
      color: #3b3b3b;
      margin-bottom: 8px;
    }
    .placeholder-text {
      color: #666;
      font-size: 0.9rem;
    }
  `]
})
export class ExpenseAllocationComponent {}