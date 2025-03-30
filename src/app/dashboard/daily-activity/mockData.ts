export interface DailyActivityType {
  id: number;
  employeeName: string;
  employeeId: string;
  company?: string;
  workShift: string[];
}

const employees: DailyActivityType[] = [
  {
    id: 1,
    employeeName: 'นิรมล',
    employeeId: '1-56001',
    company: 'หสม.มีโอฟีลส์ (55001)',
    workShift: ['MON', 'TUE', 'WED', 'THU', 'FRI'],
  },
  {
    id: 2,
    employeeName: 'ยศวดี',
    employeeId: '1-56002',
    company: 'หสม.มีโอฟีลส์ (55001)',
    workShift: ['TUE', 'WED'],
  },
  {
    id: 3,
    employeeName: 'มาเรียน',
    employeeId: '1-56003',
    company: 'บ.โนเบิลเจม แอนด์ (55002)',
    workShift: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'],
  },
  {
    id: 4,
    employeeName: 'สมพร',
    employeeId: '1-56004',
    company: 'ซิซิ่นแทนท์ (56001)',
    workShift: ['WED', 'THU'],
  },
  {
    id: 5,
    employeeName: 'พิช',
    employeeId: '1-56005',
    company: 'ซิซิ่นแทนท์ (56001)',
    workShift: ['TUE', 'SAT'],
  },
  {
    id: 6,
    employeeName: 'สุขา',
    employeeId: '1-56006',
    company: 'LINE Company (58001)',
    workShift: ['MON', 'TUE', 'WED'],
  },
  {
    id: 7,
    employeeName: 'ลัดดา',
    employeeId: '1-57001',
    company: 'LINE Company (58001)',
    workShift: ['THU', 'SUN'],
  },
  {
    id: 8,
    employeeName: 'รัศมี',
    employeeId: '1-57002',
    company: 'LINE Company (58001)',
    workShift: ['FRI', 'SAT'],
  },
  {
    id: 9,
    employeeName: 'นิตยา',
    employeeId: '1-57003',
    company: 'LINE Company (58001)',
    workShift: ['MON', 'SUN'],
  },
  {
    id: 10,
    employeeName: 'สุนทรี',
    employeeId: '1-57004',
    company: 'วันอาชาพัฒนา',
    workShift: ['SAT', 'SUN'],
  },
];

const attendanceStatusOptions = [
  { label: 'เข้าทำงาน', value: 'present', color: 'green' },
  { label: 'มาสาย', value: 'late', color: 'orange' },
  { label: 'ไม่มาทำงาน', value: 'absent', color: 'red' },
  { label: 'ทำ OT', value: 'ot', color: 'blue' },
  { label: 'มาสาย & OT', value: 'late_ot', color: 'yellow' },
  { label: 'อบรมหน้างาน', value: 'training', color: 'purple' },
  { label: 'ลบสถานะ', value: 'delete', color: 'gray' },
];

export { employees, attendanceStatusOptions };
