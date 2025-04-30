export interface Address {
  value: string;
}

export interface UserInfoData {
  firstName: string;
  lastName: string;
  phone: string;
  addresses: Address[];
  userIdi?: string;
}

export interface UserInfoProps {
  userInfo: UserInfoData;
  setUserInfo: (info: UserInfoData) => void;
  setSelectedAddress: (address: string) => void;
}
