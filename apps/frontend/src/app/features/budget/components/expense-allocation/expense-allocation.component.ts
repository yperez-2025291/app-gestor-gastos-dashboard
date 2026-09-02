import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { CategoryBudget } from '../../../../core/models/budget.model';

@Component({
  selector: 'app-expense-allocation',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent],
  templateUrl: './expense-allocation.component.html',
  styleUrl: './expense-allocation.component.css'
})
export class ExpenseAllocationComponent {
  // Referencia visual de dinero disponible para presupuestar (por defecto estimado)
  netAvailableIncome: number = 23770.40;

  // Lista inicial de categorías
  categories: CategoryBudget[] = [
    { id: '1', categoryName: 'Alimentación', budgetedAmount: 3500 },
    { id: '2', categoryName: 'Vivienda y Servicios', budgetedAmount: 4500 },
    { id: '3', categoryName: 'Transporte', budgetedAmount: 1500 },
    { id: '4', categoryName: 'Ahorro / Personal', budgetedAmount: 2000 }
  ];

  // Reserva de impuestos (los Q650 de facturas)
  taxReserveAmount: number = 650;
  taxReserveApart: boolean = true;

  // Formulario para nueva categoría
  newCategoryName: string = '';
  newCategoryAmount: number | null = null;

  // Cálculos dinámicos
  get totalCategoriesBudgeted(): number {
    return this.categories.reduce((acc, cat) => acc + (cat.budgetedAmount || 0), 0);
  }

  get totalAllocated(): number {
    const reserve = this.taxReserveApart ? this.taxReserveAmount : 0;
    return this.totalCategoriesBudgeted + reserve;
  }

  get unallocatedAmount(): number {
    return this.netAvailableIncome - this.totalAllocated;
  }

  agregarCategoria(): void {
    if (this.newCategoryName.trim() && this.newCategoryAmount !== null && this.newCategoryAmount > 0) {
      this.categories.push({
        id: Date.now().toString(),
        categoryName: this.newCategoryName.trim(),
        budgetedAmount: this.newCategoryAmount
      });
      this.newCategoryName = '';
      this.newCategoryAmount = null;
    }
  }

  eliminarCategoria(id: string): void {
    this.categories = this.categories.filter(cat => cat.id !== id);
  }

  guardarPresupuesto(): void {
    console.log('Presupuesto distribuido:', {
      categorias: this.categories,
      reservaFiscal: this.taxReserveApart ? this.taxReserveAmount : 0,
      totalAsignado: this.totalAllocated
    });
  }
}