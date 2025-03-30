export interface HolidaySetBase {
  name: string;
  clientId: number;
  isDefaultType: boolean;
}

export interface ClientHolidayBase {
  name: string;
  date: Date;
  isCustom: boolean;
}

export interface NewClientHolidayRequest extends ClientHolidayBase {
  holidaySetId: number;
}

// Create Holiday Set with Client Holiday
export interface CreateHolidaySetRequest {
  holidaySet: Omit<HolidaySetBase, "clientId">;
  clientHolidays?: ClientHolidayBase[];
}

// Update Holiday Set with Client Holiday --> PUT
export interface UpdateHolidaySetRequest {
  holidaySet?: Partial<Omit<HolidaySetBase, "clientId">>;
  clientHolidays?: Partial<ClientHolidayBase>[];
  newClientHolidays?: NewClientHolidayRequest;
}

// Create new Client Holiday in Holiday Set
// use type because the eslint no need for concern
export type CreateClientHolidayRequest = ClientHolidayBase;
export type UpdateClientHolidayReqeust = Partial<ClientHolidayBase>;

export interface HolidaySetResponse extends HolidaySetBase {
  id: number;
  clientHoliday: ClientHolidayResponse[];
}

export interface ClientHolidayResponse extends ClientHolidayBase {
  id: number;
}
