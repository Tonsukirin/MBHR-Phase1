// Demo Data with type

import { PayRateType, SalaryType } from "./allEnum";

export interface ContractSalaryBase {
  id: number;
  contractId: number;
  salaryType: SalaryType;
  startDate: Date;
  endDate: Date;
  payRateType: PayRateType;
  monthlyRate: number;
  dailyRate: number;
  employeeId: number;
}

export interface EmployeeContractSalary {
  id: number;
  contractId: number;
  startDate: Date;
  endDate: Date;
  employeeId: number | null;
}

export interface PayRateContractSalary {
  id: number;
  contractId: number;
  salaryType: SalaryType;
  startDate: Date;
  endDate: Date;
  payRateType: PayRateType;
  monthlyRate: number;
  dailyRate: number;
  otRates: {
    id: number;
    contractSalaryId: number;
    isDefault: boolean;
    rate1: number;
    rate2: number;
    rate3: number;
  };
}

// Create new contract with Employee
// Query Date: 1-6-31
export const employeeScenario1: EmployeeContractSalary[] = [
  {
    id: 1,
    contractId: 1,
    startDate: new Date(2025, 0, 12),
    endDate: new Date(2025, 11, 31),
    employeeId: 10,
  },
];

export const payrateScenario1: PayRateContractSalary[] = [
  {
    id: 1,
    contractId: 1,
    startDate: new Date(2025, 7, 1),
    endDate: new Date(2025, 7, 31),
    salaryType: SalaryType.REGULAR,
    payRateType: PayRateType.MONTHLY,
    monthlyRate: 8500,
    dailyRate: 385,
    otRates: {
      id: 1,
      contractSalaryId: 1,
      isDefault: true,
      rate1: 66,
      rate2: 88,
      rate3: 132,
    },
  },
];

// Change employee payRate: By MB / By Client
// QueryDate: 1-7-2025
export const employeeScenario2: EmployeeContractSalary[] = [
  {
    id: 1,
    contractId: 1,
    startDate: new Date(2025, 0, 12),
    endDate: new Date(2025, 11, 31),
    employeeId: 10,
  },
];

export const payrateScenario2: PayRateContractSalary[] = [
  {
    id: 1,
    contractId: 1,
    startDate: new Date(2025, 6, 1),
    endDate: new Date(2025, 6, 20),
    salaryType: SalaryType.REGULAR,
    payRateType: PayRateType.MONTHLY,
    monthlyRate: 8000,
    dailyRate: 385,
    otRates: {
      id: 1,
      contractSalaryId: 1,
      isDefault: true,
      rate1: 66,
      rate2: 88,
      rate3: 132,
    },
  },
  {
    id: 2,
    contractId: 1,
    startDate: new Date(2025, 6, 21),
    endDate: new Date(2025, 6, 31),
    salaryType: SalaryType.REGULAR,
    payRateType: PayRateType.MONTHLY,
    monthlyRate: 9500,
    dailyRate: 420,
    otRates: {
      id: 2,
      contractSalaryId: 1,
      isDefault: false,
      rate1: 90,
      rate2: 100,
      rate3: 150,
    },
  },
];

// Turn over happen
// QueryDate: 1-6-2024
export const employeeScenario3: EmployeeContractSalary[] = [
  {
    id: 1,
    contractId: 1,
    startDate: new Date(2025, 0, 12),
    endDate: new Date(2025, 6, 10),
    employeeId: 10,
  },
  {
    id: 2,
    contractId: 1,
    startDate: new Date(2025, 6, 11),
    endDate: new Date(2025, 11, 31),
    employeeId: null,
  },
];

export const payrateScenario3: PayRateContractSalary[] = [
  {
    id: 1,
    contractId: 1,
    startDate: new Date(2025, 6, 1),
    endDate: new Date(2025, 6, 10),
    salaryType: SalaryType.REGULAR,
    payRateType: PayRateType.MONTHLY,
    monthlyRate: 8500,
    dailyRate: 385,
    otRates: {
      id: 1,
      contractSalaryId: 1,
      isDefault: true,
      rate1: 66,
      rate2: 88,
      rate3: 132,
    },
  },
  {
    id: 2,
    contractId: 1,
    startDate: new Date(2025, 6, 11),
    endDate: new Date(2025, 6, 20),
    salaryType: SalaryType.TEMPORARY,
    payRateType: PayRateType.DAILY,
    monthlyRate: 8500,
    dailyRate: 385,
    otRates: {
      id: 1,
      contractSalaryId: 1,
      isDefault: true,
      rate1: 66,
      rate2: 88,
      rate3: 132,
    },
  },
  {
    id: 3,
    contractId: 1,
    startDate: new Date(2025, 6, 21),
    endDate: new Date(2025, 6, 31),
    salaryType: SalaryType.REGULAR,
    payRateType: PayRateType.MONTHLY,
    monthlyRate: 8500,
    dailyRate: 385,
    otRates: {
      id: 1,
      contractSalaryId: 1,
      isDefault: true,
      rate1: 66,
      rate2: 88,
      rate3: 132,
    },
  },
];

// Turn over happen with past turn over
// QueryDate: 1-11-2024
export const employeeScenario4: EmployeeContractSalary[] = [
  {
    id: 1,
    contractId: 1,
    startDate: new Date(2025, 0, 12),
    endDate: new Date(2025, 6, 10),
    employeeId: 10,
  },
  {
    id: 2,
    contractId: 1,
    startDate: new Date(2025, 6, 11),
    endDate: new Date(2025, 9, 31),
    employeeId: 11,
  },
  {
    id: 3,
    contractId: 1,
    startDate: new Date(2025, 10, 1),
    endDate: new Date(2025, 11, 31),
    employeeId: null,
  },
];

export const payrateScenario4: PayRateContractSalary[] = [
  {
    id: 1,
    contractId: 1,
    startDate: new Date(2025, 10, 1),
    endDate: new Date(2025, 10, 20),
    salaryType: SalaryType.TEMPORARY,
    payRateType: PayRateType.DAILY,
    monthlyRate: 8500,
    dailyRate: 385,
    otRates: {
      id: 1,
      contractSalaryId: 1,
      isDefault: true,
      rate1: 66,
      rate2: 88,
      rate3: 132,
    },
  },
  {
    id: 2,
    contractId: 1,
    startDate: new Date(2025, 10, 21),
    endDate: new Date(2025, 10, 30),
    salaryType: SalaryType.REGULAR,
    payRateType: PayRateType.MONTHLY,
    monthlyRate: 8500,
    dailyRate: 385,
    otRates: {
      id: 1,
      contractSalaryId: 1,
      isDefault: true,
      rate1: 66,
      rate2: 88,
      rate3: 132,
    },
  },
];
