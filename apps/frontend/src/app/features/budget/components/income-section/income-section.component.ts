import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../../../shared/components/button/button.component';

@Component({
  selector: 'app-income-section',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent],
  templateUrl: './income-section.component.html',
  styleUrl: './income-section.component.css'
})
export class IncomeSectionComponent {
  // Valores configurables por el usuario
  fixedSalary: number = 12000;
  invoicedIncome: number = 13000;
  
  // Opciones de Deducción e Impuestos
  applyIsrInvoiced: boolean = true; // 5% sobre facturas
  applyIgss: boolean = true;        // 4.83% sobre sueldo fijo
  manualIsrPlanilla: number = 0;   // Retención ISR opcional de planilla

  // Métodos de cálculo dinámicos
  get isrReservation(): number {
    return this.applyIsrInvoiced ? this.invoicedIncome * 0.05 : 0;
  }

  get igssDeduction(): number {
    return this.applyIgss ? this.fixedSalary * 0.0483 : 0;
  }

  get totalGrossIncome(): number {
    return (this.fixedSalary || 0) + (this.invoicedIncome || 0);
  }

  get totalDeductions(): number {
    return this.isrReservation + this.igssDeduction + (this.manualIsrPlanilla || 0);
  }

  get netAvailableIncome(): number {
    return this.totalGrossIncome - this.totalDeductions;
  }

  guardarConfiguracion(): void {
    console.log('Ingresos y deducciones actualizados:', {
      neto: this.netAvailableIncome,
      reservaISR: this.isrReservation
    });
  }
}