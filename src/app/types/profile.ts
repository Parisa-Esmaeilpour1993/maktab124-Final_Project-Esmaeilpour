export interface AddressItem {
  id: string;
  value: string;
}
export interface UserProps {
  id?: string;
  firstName: string;
  lastName: string;
  addresses: AddressItem[];
  birthDate: string;
  gender: string;
  phoneNumber: string;
  education: string;
}
