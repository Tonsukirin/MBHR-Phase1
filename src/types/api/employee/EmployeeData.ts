export interface Address {
  id: number;
  houseNumber: string;
  building: string | null;
  floor: string | null;
  village: string;
  alley: string;
  street: string;
  subDistrict: string;
  district: string;
  province: string;
  postalCode: string;
  latitude: number | null;
  longitude: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdditionalInfo {
  id: number;
  employeeId: string;
  citizenId: string;
  height: number | null;
  weight: number | null;
  maritalStatus: string | null;
  spouseTitle: string | null;
  spouseName: string | null;
  spouseSurname: string | null;
  spousePhone: string | null;
  spouseOccupation: string | null;
  childrenCount: number | null;
  medicalConditions: string | null;
  educationHighest: string | null;
  educationMajor: string | null;
  educationGpax: string | null;
  educationName: string | null;
  hospitalName: string | null;
  emergencyName: string | null;
  emergencyRelation: string | null;
  emergencyPhone: string | null;
  workHistory: WorkHistory[] | null;
  createdAt: string;
  updatedAt: string;
}

export interface WorkHistory {
  workPlace: string;
  contractDuration: string;
  jobType: string;
  salary: string;
  reason: string;
}

export interface EmployeeData {
  id: string;
  shownEmployeeId: string;
  isThai: boolean;
  title: string;
  name: string;
  surname: string;
  nickname: string;
  phone: string;
  status: string;
  birthDate: string;
  startDate: string;
  position: string;
  isSocialSecurityEnabled: boolean;
  createdAt: string;
  updatedAt: string;
  currentAddressId: number;
  permanentAddressId: number;
  currentAddress: Address;
  additionalInfo: AdditionalInfo;
}
