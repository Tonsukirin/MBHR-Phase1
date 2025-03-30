export interface DataType {
  id: number;
  nameSurname: string;
  nickname: string;
  location: string;
  age: number;
  phoneNum: string;
  position: string;
  contractAmount: number;
}

enum EmployeePosition {
  FULLTIMEMAID = 'ประจำ',
  SPAREMAID = 'สแปร์',
  INSPECTOR = 'สายตรวจ',
  SALE = 'ฝ่ายขาย',
  HR = 'ฝ่ายบุคคล',
  STOCK = 'ฝ่ายจัดส่ง',
}

const getRandomPosition = (): EmployeePosition => {
  const positions = Object.values(EmployeePosition);
  return positions[Math.floor(Math.random() * positions.length)];
};

export const data: DataType[] = [
  ...Array.from({ length: 70 }, (_, index) => ({
    id: index + 1,
    nameSurname: `ชื่อ ${index + 1} นามสกุล ${index + 1}`,
    nickname: ['ฟ้า', 'น้ำ', 'หมู', 'ดรีม', 'โอ'][index % 5],
    location: [
      'ลาดพร้าว, จันทรเกษม',
      'คลองเตย, คลองตัน',
      'บางเขน, อนุสาวรีย์',
      'ห้วยขวาง, ห้วยขวาง',
      'บางซื่อ, เตาปูน',
    ][index % 5],
    age: Math.floor(Math.random() * 40) + 21, // Random age between 21 and 60
    phoneNum: `${Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, '0')}-${Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, '0')}-${Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, '0')}`,
    position: getRandomPosition(), // Randomly assign position
    contractAmount: Math.floor(Math.random() * 10) + 1,
  })),
];
