import { AddressBase, AddressResponse } from "../mainType";
import { ClientContractBase } from "./clientContract";
import { ClientContactPersonBase } from "./contactPerson";
import { HolidaySetResponse } from "./holidaySet";

export interface ClientBase {
  id: number,
  shownClientId: string;
  registeredCapital: number;
  name: string;
  industry?: string;
  contactPerson: ClientContactPersonBase[];
}

export interface CreateClientRequest {
  client: ClientBase;
  address: AddressBase;
}

export interface UpdateClientRequest {
  client?: Partial<ClientBase>;
  address?: Partial<AddressBase>;
}

export interface ClientsResponse extends ClientBase {
  addressId: number;
  createdAt: Date;
  updatedAt: Date;
  address: AddressResponse;
  clientContract: ClientContractBase;
  holidaySet: HolidaySetResponse;
}
