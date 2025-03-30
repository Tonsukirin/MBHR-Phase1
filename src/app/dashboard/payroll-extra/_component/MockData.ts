export interface PayrollExtraType {
  employeeId: string;
  employeeName: string;
  extraPay?: number;
  note?: string;
}

export const payrollExtraTable: PayrollExtraType[] = [];
