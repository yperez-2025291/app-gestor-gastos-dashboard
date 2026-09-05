import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { CustomTaxDeduction } from '../../../../core/models/budget.model';
import { BudgetService } from '../../../../core/services/budget.service';
import { TokenStorageService } from '../../../../core/services/token-storage.service';

@Component({
  selector: 'app-income-section',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent],
  templateUrl: './income-section.component.html',
  styleUrl: './income-section.component.css'
})
export class IncomeSectionComponent implements OnInit {
  private budgetService = inject(BudgetService);
  private tokenStorage = inject(TokenStorageService);

  // Usamos strings o números controlados para evitar que el input colapse en NaN
  fixedSalary: number = 0;
  invoicedIncome: number = 0;
  customTaxes: CustomTaxDeduction[] = [];

  newTaxName: string = '';
  newTaxType: 'percentage' | 'fixed' = 'percentage';
  newTaxValue: number | null = null;
  newTaxAppliesTo: 'fixed' | 'invoiced' | 'total' = 'invoiced';

  ngOnInit(): void {
    this.cargarPresupuesto();
  }

  cargarPresupuesto(): void {
    let user = this.tokenStorage.getUser();
    
    if (!user || !user.id) {
      const localUser = window.sessionStorage.getItem('auth-user') || window.localStorage.getItem('auth-user');
      if (localUser) {
        user = JSON.parse(localUser);
      }
    }

    if (!user?.id) return;

    const fecha = new Date();
    this.budgetService.getBudget(user.id, fecha.getMonth() + 1, fecha.getFullYear()).subscribe({
      next: (res: any) => {
        const budgetData = res?.data?.budget || res?.data || res;
        const taxesData = res?.data?.taxes || res?.taxes;

        if (budgetData) {
          // Capturamos cualquier variante de nombre que use tu base de datos
          this.fixedSalary = Number(budgetData.fixedSalary ?? budgetData.monthlyIncome ?? 0);
          this.invoicedIncome = Number(budgetData.invoicedIncome ?? budgetData.additionalIncome ?? 0);
        }

        if (Array.isArray(taxesData)) {
          this.customTaxes = taxesData.map((t: any) => ({
            id: t.id || `tax-${Date.now()}`,
            name: t.name,
            type: (t.type || 'percentage').toLowerCase() as 'percentage' | 'fixed',
            value: Number(t.value) || 0,
            appliesTo: (t.appliesTo || 'invoiced').toLowerCase() as 'fixed' | 'invoiced' | 'total',
            active: t.active !== undefined ? Boolean(t.active) : true
          }));
        } else {
          this.customTaxes = [];
        }
      },
      error: () => {
        this.customTaxes = [];
      }
    });
  }

  // Método seguro para evitar números gigantes o NaN al borrar el input
  onInputSueldo(event: any): void {
    const val = event.target.value;
    this.fixedSalary = (val === '' || val === null || isNaN(val)) ? 0 : Number(val);
  }

  onInputFacturado(event: any): void {
    const val = event.target.value;
    this.invoicedIncome = (val === '' || val === null || isNaN(val)) ? 0 : Number(val);
  }

  get totalGrossIncome(): number {
    const salary = Number(this.fixedSalary) || 0;
    const invoiced = Number(this.invoicedIncome) || 0;
    return Math.max(0, salary + invoiced);
  }

  calculateTaxAmount(tax: CustomTaxDeduction): number {
    if (!tax || !tax.active) return 0;

    const salary = Number(this.fixedSalary) || 0;
    const invoiced = Number(this.invoicedIncome) || 0;

    let baseAmount = 0;
    if (tax.appliesTo === 'fixed') baseAmount = salary;
    else if (tax.appliesTo === 'invoiced') baseAmount = invoiced;
    else baseAmount = this.totalGrossIncome;

    const taxValue = Number(tax.value) || 0;
    const result = tax.type === 'percentage' 
      ? baseAmount * (taxValue / 100) 
      : taxValue;

    return Math.max(0, isNaN(result) ? 0 : result);
  }

  get totalDeductions(): number {
    return Math.max(0, this.customTaxes.reduce((sum, tax) => sum + this.calculateTaxAmount(tax), 0));
  }

  get netAvailableIncome(): number {
    return Math.max(0, this.totalGrossIncome - this.totalDeductions);
  }

  agregarImpuesto(): void {
    if (this.newTaxName.trim() && this.newTaxValue !== null && this.newTaxValue > 0) {
      this.customTaxes.push({
        id: `temp-${Date.now()}`,
        name: this.newTaxName.trim(),
        type: this.newTaxType,
        value: Number(this.newTaxValue),
        appliesTo: this.newTaxAppliesTo,
        active: true
      });
      this.newTaxName = '';
      this.newTaxValue = null;
    }
  }

  eliminarImpuesto(id: string): void {
    this.customTaxes = this.customTaxes.filter(t => t.id !== id);
  }

guardarConfiguracion(): void {
    let user = this.tokenStorage.getUser();
    
    if (!user || !user.id) {
      const localUser = window.sessionStorage.getItem('auth-user') || window.localStorage.getItem('auth-user');
      if (localUser) {
        user = JSON.parse(localUser);
      }
    }

    if (!user?.id) {
      alert('Error: No hay sesión de usuario activa.');
      return;
    }

    const fecha = new Date();
    const cleanSalary = Number(this.fixedSalary) || 0;
    const cleanInvoiced = Number(this.invoicedIncome) || 0;

    const payload = {
      userId: user.id,
      fixedSalary: cleanSalary,
      invoicedIncome: cleanInvoiced,
      monthlyIncome: cleanSalary,
      additionalIncome: cleanInvoiced,
      month: fecha.getMonth() + 1,
      year: fecha.getFullYear(),
      taxes: this.customTaxes.map(t => ({
        id: t.id && !t.id.startsWith('temp-') ? t.id : undefined,
        name: t.name,
        type: t.type.toUpperCase(),
        value: Number(t.value) || 0,
        appliesTo: t.appliesTo.toUpperCase(),
        active: t.active
      }))
    };

    console.log('Enviando payload al backend:', payload);

    this.budgetService.saveBudget(payload).subscribe({
      next: (res) => {
        console.log('Respuesta del servidor al guardar:', res);
        alert('¡Configuración guardada con éxito en la base de datos!');
        this.cargarPresupuesto(); // Vuelve a cargar para asegurar sincronización
      },
      error: (err) => {
        console.error('Error crítico al guardar:', err);
        alert('Error al guardar en el servidor. Revisa la consola (F12).');
      }
    });
  }
}