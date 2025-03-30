export interface SalaryCalculationType {
  id: number;
  employeeId: string;
  employeeName: string;
  totalIncome: number;
  totalExpense?: number;
  socialSecurity: number;
  netIncome: number;
}

export const salaryCalculationTable: SalaryCalculationType[] = [
  {
    id: 1,
    employeeId: '1-56001',
    employeeName: 'นางสาวโปรโม ภัทรกัล',
    totalIncome: 7060,
    totalExpense: 1000,
    socialSecurity: 212, // ~3% of 7060
    netIncome: 7060 - 1000 - 212, // 5848
  },
  {
    id: 2,
    employeeId: '1-56002',
    employeeName: 'นายศราวุธ ศรีชัย',
    totalIncome: 9300,
    totalExpense: 1500,
    socialSecurity: 279, // ~3% of 9300
    netIncome: 9300 - 1500 - 279, // 7521
  },
  {
    id: 3,
    employeeId: '1-56003',
    employeeName: 'นางสาวเพชรา สกาวใจ',
    totalIncome: 12000,
    totalExpense: 2000,
    socialSecurity: 360, // 3% of 12000
    netIncome: 12000 - 2000 - 360, // 9640
  },
  {
    id: 4,
    employeeId: '1-56004',
    employeeName: 'นายภานุวัฒน์ บริบูรณ์',
    totalIncome: 8000,
    totalExpense: 800,
    socialSecurity: 240, // 3% of 8000
    netIncome: 8000 - 800 - 240, // 6960
  },
  {
    id: 5,
    employeeId: '1-56005',
    employeeName: 'นางสาวพรพรรณ ลาภลอย',
    totalIncome: 7500,
    totalExpense: 1000,
    socialSecurity: 225, // 3% of 7500
    netIncome: 7500 - 1000 - 225, // 6275
  },
  {
    id: 6,
    employeeId: '1-56006',
    employeeName: 'นายอภิชาติ พัฒนกมลกุล',
    totalIncome: 14500,
    totalExpense: 2000,
    socialSecurity: 435, // 3% of 14500
    netIncome: 14500 - 2000 - 435, // 12065
  },
  {
    id: 7,
    employeeId: '1-56007',
    employeeName: 'นางสาวอารีย์ นามสมมุติ',
    totalIncome: 9600,
    totalExpense: 1200,
    socialSecurity: 288, // 3% of 9600
    netIncome: 9600 - 1200 - 288, // 8112
  },
  {
    id: 8,
    employeeId: '1-56008',
    employeeName: 'นายวรยุทธ สุขใจ',
    totalIncome: 8400,
    totalExpense: 500,
    socialSecurity: 252, // 3% of 8400
    netIncome: 8400 - 500 - 252, // 7648
  },
  {
    id: 9,
    employeeId: '1-56009',
    employeeName: 'นางสาวมัณฑนา วัฒนวิจิตร',
    totalIncome: 10000,
    totalExpense: 1000,
    socialSecurity: 300, // 3% of 10000
    netIncome: 10000 - 1000 - 300, // 8700
  },
  {
    id: 10,
    employeeId: '1-56010',
    employeeName: 'นางสาวรัตนา เทวพรหม',
    totalIncome: 7050,
    totalExpense: 700,
    socialSecurity: 212, // ~3% of 7050
    netIncome: 7050 - 700 - 212, // 6138
  },
  {
    id: 11,
    employeeId: '1-56011',
    employeeName: 'นางสาวกรองแก้ว ศรีสยาม',
    totalIncome: 8150,
    totalExpense: 1500,
    socialSecurity: 245, // 3% of 8150
    netIncome: 8150 - 1500 - 245, // 6405
  },
  {
    id: 12,
    employeeId: '1-56012',
    employeeName: 'นายประภาส นามสกุล',
    totalIncome: 9450,
    totalExpense: 1000,
    socialSecurity: 284, // ~3% of 9450
    netIncome: 9450 - 1000 - 284, // 8166
  },
  {
    id: 13,
    employeeId: '1-56013',
    employeeName: 'นางสาวจันทนา บุญมาก',
    totalIncome: 11200,
    totalExpense: 2000,
    socialSecurity: 336, // 3% of 11200
    netIncome: 11200 - 2000 - 336, // 884
  },
  {
    id: 14,
    employeeId: '1-56014',
    employeeName: 'นายทศพร วังทอง',
    totalIncome: 9500,
    totalExpense: 1200,
    socialSecurity: 285, // 3% of 9500
    netIncome: 9500 - 1200 - 285, // 8015
  },
  {
    id: 15,
    employeeId: '1-56015',
    employeeName: 'นางสาวขวัญฤทัย เทวพรหม',
    totalIncome: 7800,
    totalExpense: 800,
    socialSecurity: 234, // 3% of 7800
    netIncome: 7800 - 800 - 234, // 6766
  },
  {
    id: 16,
    employeeId: '1-56016',
    employeeName: 'นายสมชาย ใจดี',
    totalIncome: 15200,
    totalExpense: 2000,
    socialSecurity: 456, // 3% of 15200
    netIncome: 15200 - 2000 - 456, // 12744
  },
  {
    id: 17,
    employeeId: '1-56017',
    employeeName: 'นางสาวสโรชา เกศิณ',
    totalIncome: 8600,
    totalExpense: 1000,
    socialSecurity: 258, // 3% of 8600
    netIncome: 8600 - 1000 - 258, // 7342
  },
  {
    id: 18,
    employeeId: '1-56018',
    employeeName: 'นายก้องเกียรติ แสนดี',
    totalIncome: 7100,
    totalExpense: 500,
    socialSecurity: 213, // 3% of 7100
    netIncome: 7100 - 500 - 213, // 6387
  },
  {
    id: 19,
    employeeId: '1-56019',
    employeeName: 'นางสาวปริญญา ยิ่งยง',
    totalIncome: 12000,
    totalExpense: 1500,
    socialSecurity: 360, // 3% of 12000
    netIncome: 12000 - 1500 - 360, // 10140
  },
  {
    id: 20,
    employeeId: '1-56020',
    employeeName: 'นางสาวอุไร มหาพรหม',
    totalIncome: 9150,
    totalExpense: 800,
    socialSecurity: 275, // ~3% of 9150
    netIncome: 9150 - 800 - 275, // 8075
  },
];
