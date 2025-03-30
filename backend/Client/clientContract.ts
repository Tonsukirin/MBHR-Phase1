import { DayOfWeek, PayRateType, TransportationType } from "../allEnum";
import { AddressBase } from "../mainType";

export interface ClientContractBase {
  commonInfo: {
    name: string;
    salespersonId?: number;
    inspectorId?: number;
    employeeId?: number;
    startDate: Date;
    endDate: Date;
  };
  addressRelated: {
    isSameAddress: boolean;
    address?: AddressBase;
  };
  transportRelated: {
    transportationType: TransportationType;
    transportationTypeDetail: string;
    transportationDetail: string;
    googleMapLink: string;
    images?: FormData[];
  };
  shiftRelated: {
    shift: ClientContractShiftBase[];
    otRates: OtRatesBase;
    holidaySetId: number;
  };
}

export interface ClientContractShiftBase {
  payRateType: PayRateType;
  shiftLevel: number;
  dayOfWeeks: DayOfWeek[];
  startTime: string;
  endTime: string;
  dailyRate: number;
  monthlyRate?: number;
}

export interface OtRatesBase {
  isDefault: boolean;
  rate1?: number;
  rate2?: number;
  rate3?: number;
}
