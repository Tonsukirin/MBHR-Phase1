export interface AddressBase {
  houseNumber: string;
  moo?: string;
  village?: string;
  building?: string;
  floor?: string;
  alley?: string;
  street?: string;
  subDistrict: string;
  district: string;
  province: string;
  postalCode: string;
  latitude?: number;
  longitude?: number;
}

export interface AddressResponse extends AddressBase {
  id: number;
  updatedAt?: string;
  createdAt?: string;
}
