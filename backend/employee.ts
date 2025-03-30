import { EmployeePosition, EmployeeStatus } from './allEnum';
import { AddressBase, AddressResponse } from './mainType';

export interface CreateEmployeeRequest {
  employee: {
    isThai: boolean;
    pictureUrl?: string;
    isSameAddress: boolean;
    title: string;
    name: string;
    surname: string;
    nickname: string;
    phone: string;
    status: EmployeeStatus;
    birthDate: Date;
    startDate: Date;
    position: EmployeePosition;
    isSocialSecurityEnabled: boolean;
  };
  addresses: {
    current: AddressBase;
    permanent: AddressBase;
  };
  additionalInfo: {
    citizenId: string;
    height: number;
    weight: number;
    maritalStatus?: string;
    spouseTitle?: string;
    spouseName?: string;
    spouseSurname?: string;
    spousePhone?: string;
    spouseOccupation?: string;
    childrenCount?: number;
    medicalConditions?: string;
    educationHighest?: string;
    educationMajor?: string;
    educationGpax?: number;
    educationName?: string;
    socialSecurityHospitalName?: string;
    socialSecurityId?: string;
    emergencyName?: string;
    emergencyRelation?: string;
    emergencyPhone?: string;
    workHistory?: Record<string, string | null>[];
  };
}

export interface UpdateEmployeeRequest {
  employee?: {
    isThai?: boolean;
    title?: string;
    name?: string;
    surname?: string;
    nickname?: string;
    phone?: string;
    status?: EmployeeStatus;
    birthDate?: Date;
    startDate?: Date;
    position?: EmployeePosition;
    isSocialSecurityEnabled?: boolean;
    isSameAddress?: boolean;
  };
  addresses?: {
    current?: Partial<AddressBase>;
    permanent?: Partial<AddressBase>;
  };
  additionalInfo?: {
    citizenId?: string;
    height?: number;
    weight?: number;
    maritalStatus?: string;
    spouseTitle?: string;
    spouseName?: string;
    spouseSurname?: string;
    spousePhone?: string;
    spouseOccupation?: string;
    childrenCount?: number;
    medicalConditions?: string;
    educationHighest?: string;
    educationMajor?: string;
    educationGpax?: number;
    educationName?: string;
    socialSecurityHospitalName?: string;
    socialSecurityId?: string;
    emergencyName?: string;
    emergencyRelation?: string;
    emergencyPhone?: string;
    workHistory?: Record<string, string | null>[];
  };
}

export interface EmployeeResponse {
  id: number;
  shownEmployeeId: string;
  pictureUrl: string;
  isThai: boolean;
  title: string;
  name: string;
  surname: string;
  nickname: string;
  phone: string;
  birthDate: Date;
  isSocialSecurityEnabled: boolean;
  isSameAddress: boolean;
  currentAddressId: number;
  permanentAddressId: number;
  status: EmployeeStatus;
  startDate: Date;
  position: EmployeePosition;
  createdAt: Date;
  updatedAt: Date;
  currentAddress: AddressResponse;
  permanentAddress: AddressResponse;
  additionalInfo: {
    id: number;
    employeeId: number;
    citizenId: string;
    height: number;
    weight: number;
    maritalStatus?: string;
    spouseTitle?: string;
    spouseName?: string;
    spouseSurname?: string;
    spousePhone?: string;
    spouseOccupation?: string;
    childrenCount?: number;
    medicalConditions?: string;
    educationHighest?: string;
    educationMajor?: string;
    educationGpax?: number;
    educationName?: string;
    socialSecurityHospitalName?: string;
    socialSecurityId?: string;
    emergencyName?: string;
    emergencyRelation?: string;
    emergencyPhone?: string;
    workHistory?: Record<string, string | null>[];
    createdAt: Date;
    updatedAt: Date;
  };
}
