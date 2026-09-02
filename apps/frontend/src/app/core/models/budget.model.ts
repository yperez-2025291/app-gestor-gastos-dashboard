export interface IncomeItem {
  id: string;
  description: string;
  amount: number;
  isInvoiced: boolean;
}

export interface CustomTaxDeduction {
  id: string;
  name: string;
  type: 'percentage' | 'fixed'; // Porcentaje o Monto Fijo en Q
  value: number;                // ej. 5 (para 5%) o 650 (para Q650)
  appliesTo: 'fixed' | 'invoiced' | 'total'; // A qué ingreso afecta
  active: boolean;              // Para activar/desactivar el impuesto fácil
}

export interface CategoryBudget {
  id: string;
  categoryName: string;
  budgetedAmount: number;
}