import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { CustomTaxDeduction } from '../../../../core/models/budget.model';

@Component({
  selector: 'app-income-section',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent],
  templateUrl: './income-section.component.html',
  styleUrl: './income-section.component.css'
})
export class IncomeSectionComponent {
  // Ingresos editables
  fixedSalary: number = 12000;
  invoicedIncome: number = 13000;

  // Lista de impuestos/deducciones creados por el usuario
  customTaxes: CustomTaxDeduction[] = [
    {
      id: '1',
      name: 'Reserva ISR (Facturas)',
      type: 'percentage',
      value: 5,
      appliesTo: 'invoiced',
      active: true
    },
    {
      id: '2',
      name: 'Cuota IGSS',
      type: 'percentage',
      value: 4.83,
      appliesTo: 'fixed',
      active: true
    },
    {
      id: '3',
      name: 'Reserva Fin de Mes',
      type: 'fixed',
      value: 650,
      appliesTo: 'total',
      active: true
    }
  ];

  // Campos para crear nuevo impuesto
  newTaxName: string = '';
  newTaxType: 'percentage' | 'fixed' = 'percentage';
  newTaxValue: number | null = null;
  newTaxAppliesTo: 'fixed' | 'invoiced' | 'total' = 'invoiced';

  // Métodos de cálculo dinámicos
  get totalGrossIncome(): number {
    return (this.fixedSalary || 0) + (this.invoicedIncome || 0);
  }

  calculateTaxAmount(tax: CustomTaxDeduction): number {
    if (!tax.active) return 0;

    let baseAmount = 0;
    if (tax.appliesTo === 'fixed') baseAmount = this.fixedSalary || 0;
    else if (tax.appliesTo === 'invoiced') baseAmount = this.invoicedIncome || 0;
    else baseAmount = this.totalGrossIncome;

    if (tax.type === 'percentage') {
      return baseAmount * ((tax.value || 0) / 100);
    } else {
      return tax.value || 0;
    }
  }

  get totalDeductions(): number {
    return this.customTaxes.reduce((sum, tax) => sum + this.calculateTaxAmount(tax), 0);
  }

  get netAvailableIncome(): number {
    return this.totalGrossIncome - this.totalDeductions;
  }

  agregarImpuesto(): void {
    if (this.newTaxName.trim() && this.newTaxValue !== null && this.newTaxValue > 0) {
      this.customTaxes.push({
        id: Date.now().toString(),
        name: this.newTaxName.trim(),
        type: this.newTaxType,
        value: this.newTaxValue,
        appliesTo: this.newTaxAppliesTo,
        active: true
      });

      // Limpiar formulario
      this.newTaxName = '';
      this.newTaxValue = null;
    }
  }

  eliminarImpuesto(id: string): void {
    this.customTaxes = this.customTaxes.filter(t => t.id !== id);
  }

  guardarConfiguracion(): void {
    console.log('Ingresos e Impuestos guardados:', {
      ingresoNeto: this.netAvailableIncome,
      impuestos: this.customTaxes
    });
  }
}