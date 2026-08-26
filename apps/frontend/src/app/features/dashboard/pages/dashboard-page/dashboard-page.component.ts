import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardDataComponent } from '../../../../shared/components/card-data/card-data.component';
import { ExpenseTableComponent, GastoItem } from '../../components/expense-table/expense-table.component';
import { ExpenseChartComponent } from '../../components/expense-chart/expense-chart.component';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CommonModule, CardDataComponent, ExpenseTableComponent, ExpenseChartComponent],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.css'
})
export class DashboardPageComponent {
  mayorGastado = 1200.50;
  totalGastado = 4350.00;
  presupuestoRestante = 1650.00;

  ultimosGastos: GastoItem[] = [
    { id: '1', concepto: 'Supermercado', categoria: 'Alimentación', fecha: '2026-08-25', monto: 350.50 },
    { id: '2', concepto: 'Mantenimiento Vehículo', categoria: 'Transporte', fecha: '2026-08-23', monto: 800.00 },
    { id: '3', concepto: 'Servicio de Internet', categoria: 'Servicios', fecha: '2026-08-20', monto: 60.00 }
  ];
}