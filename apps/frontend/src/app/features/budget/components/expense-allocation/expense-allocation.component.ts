import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { CategoryBudget } from '../../../../core/models/budget.model';
import { BudgetService } from '../../../../core/services/budget.service';

@Component({
  selector: 'app-expense-allocation',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent],
  templateUrl: './expense-allocation.component.html', // <--- CORREGIDO AQUÍ
  styleUrl: './expense-allocation.component.css'
})
export class ExpenseAllocationComponent implements OnInit {
  private budgetService = inject(BudgetService);

  netAvailableIncome: number = 0;
  categories: CategoryBudget[] = [];

  taxReserveAmount: number = 0;
  taxReserveApart: boolean = true;

  newCategoryName: string = '';
  newCategoryAmount: number | null = null;

  ngOnInit(): void {
    this.budgetService.budget$.subscribe((data) => {
      if (!data) return;

      const budget = data.budget || data;
      const salary = Number(budget.fixedSalary) || 0;
      const invoiced = Number(budget.invoicedIncome) || 0;
      const totalIncome = salary + invoiced;

      let deductions = 0;
      if (Array.isArray(data.taxes)) {
        deductions = data.taxes.reduce((sum: number, tax: any) => {
          if (!tax.active) return sum;
          let base = tax.appliesTo === 'FIXED' ? salary : (tax.appliesTo === 'INVOICED' ? invoiced : totalIncome);
          let val = tax.type === 'PERCENTAGE' ? base * (Number(tax.value) / 100) : Number(tax.value);
          return sum + val;
        }, 0);
      }

      this.netAvailableIncome = Math.max(0, totalIncome - deductions);
      this.taxReserveAmount = deductions;
      if (data.categories) {
        this.categories = data.categories;
      }
    });
  }

  get totalCategoriesBudgeted(): number {
    return this.categories.reduce((acc, cat) => acc + (Number(cat.budgetedAmount) || 0), 0);
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
        budgetedAmount: Number(this.newCategoryAmount)
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