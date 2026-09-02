export interface IncomeItem {
  id: string;
  description: string;
  amount: number;
  isInvoiced: boolean;
}

export interface IncomeSummary {
  fixedSalary: number;
  invoicedTotal: number;
  isrReservation: number; // 5% de las facturas
  igssDeduction: number;  // 4.83% u otro monto manual
  netAvailable: number;
}

export interface CategoryBudget {
  id: string;
  categoryName: string;
  budgetedAmount: number;
}