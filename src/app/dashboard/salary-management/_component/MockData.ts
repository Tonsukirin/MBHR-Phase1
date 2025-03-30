export interface DisbursementDataType {
  employeeId: string;
  employeeName: string;
  estimatedSalary: number;
  disbursement?: number;
}

export const disbursementTable: DisbursementDataType[] = [
  {
    employeeId: '1-56001',
    employeeName: 'นางสาวนิรมล   ภัทรโกศล',
    estimatedSalary: 7060,
    disbursement: 1200,
  },
  {
    employeeId: '1-56002',
    employeeName: 'นางยุวดี   ศรีวิชัย',
    estimatedSalary: 7900,
  },
  {
    employeeId: '1-56003',
    employeeName: 'นางสาวมาเรียม   มาริญา',
    estimatedSalary: 4236,
  },
  {
    employeeId: '1-56004',
    employeeName: 'นางสาวสมพร   ลาภสกุล ',
    estimatedSalary: 5070,
  },
  {
    employeeId: '1-56005',
    employeeName: 'นายสมชาย   จันทร์ทอง',
    estimatedSalary: 6500,
    disbursement: 1000,
  },
  {
    employeeId: '1-56006',
    employeeName: 'นางสาวปวีณา   ศรีสุข',
    estimatedSalary: 7200,
    disbursement: 1500,
  },
  {
    employeeId: '1-56007',
    employeeName: 'นายวรพล   สุขสม',
    estimatedSalary: 8300,
  },
  {
    employeeId: '1-56008',
    employeeName: 'นางสาวอรพรรณ   วิไลพร',
    estimatedSalary: 6800,
  },
  {
    employeeId: '1-56009',
    employeeName: 'นายสมศักดิ์   รัตนชัย',
    estimatedSalary: 7500,
    disbursement: 1300,
  },
  {
    employeeId: '1-56010',
    employeeName: 'นางสาวสุชาดา   วิไลลักษณ์',
    estimatedSalary: 6800,
    disbursement: 900,
  },
  {
    employeeId: '1-56011',
    employeeName: 'นายประสิทธิ์   วัฒนชัย',
    estimatedSalary: 8200,
  },
  {
    employeeId: '1-56012',
    employeeName: 'นางสาวชลธิชา   ชัยนิมิตร',
    estimatedSalary: 6100,
    disbursement: 1100,
  },
  {
    employeeId: '1-56013',
    employeeName: 'นายอนุชา   สุขสวัสดิ์',
    estimatedSalary: 9000,
    disbursement: 2000,
  },
  {
    employeeId: '1-56014',
    employeeName: 'นางสาวณิชา   พรประเสริฐ',
    estimatedSalary: 6700,
    disbursement: 1300,
  },
  {
    employeeId: '1-56015',
    employeeName: 'นายพงษ์เทพ   อัศวินชัย',
    estimatedSalary: 8100,
  },
  {
    employeeId: '1-56016',
    employeeName: 'นางสาวปราณี   สมบูรณ์',
    estimatedSalary: 7200,
    disbursement: 1400,
  },
  {
    employeeId: '1-56017',
    employeeName: 'นายวรยุทธ   วรานนท์',
    estimatedSalary: 8500,
  },
  {
    employeeId: '1-56018',
    employeeName: 'นางสาวอัจฉรา   มณีรัตน์',
    estimatedSalary: 6400,
    disbursement: 1000,
  },
];

export interface UniformTableType {
  employeeId: string;
  employeeName: string;
  outstandingBalance?: number;
  uniformDisbursement?: number;
  uniformDeduction?: number;
  totalOutstandingBalance?: number;
}

export const uniformTable: UniformTableType[] = [
  {
    employeeId: '1-56001',
    employeeName: 'นางสาวนิรมล   ภัทรโกศล',
    outstandingBalance: 200,
  },
  {
    employeeId: '1-56002',
    employeeName: 'นางยุวดี   ศรีวิชัย',
    outstandingBalance: 300,
  },
  {
    employeeId: '1-56003',
    employeeName: 'นางสาวมาเรียม   มาริญา',
    outstandingBalance: 400,
  },
];
export interface LoanTableType {
  employeeId: string;
  employeeName: string;
  outstandingDebt?: number;
  loan?: number;
  interest?: number;
  loanDeduction?: number;
}

export const loanTable: UniformTableType[] = [];

export interface EtcTableType {
  employeeId: string;
  employeeName: string;
  salary?: number;
  deduction?: number;
  note?: string;
}

export const etcTable: EtcTableType[] = [];
