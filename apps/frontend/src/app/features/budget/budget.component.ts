import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IncomeSectionComponent } from './components/income-section/income-section.component';
import { ExpenseAllocationComponent } from './components/expense-allocation/expense-allocation.component';

@Component({
  selector: 'app-budget',
  standalone: true,
  imports: [
    CommonModule, 
    IncomeSectionComponent, 
    ExpenseAllocationComponent
  ],
  templateUrl: './budget.component.html',
  styleUrl: './budget.component.css'
})
export class BudgetComponent {}