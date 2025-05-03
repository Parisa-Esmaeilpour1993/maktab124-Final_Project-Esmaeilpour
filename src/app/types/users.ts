export interface UserProps {
  application_key: string;
  createdAt: string;
  data_id: string;
  email: string;
  is_admin: boolean;
  password: string;
  type: string;
  __v: number;
  _id: string;
  name: string;
  id: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  education: string;
  birthDate: string;
  gender: string;
  userIdi: string;
  addresses: [
    {
      id: string;
      value: string;
    }
  ];
}

export interface AdminDataProps {
  firstName: string;
  lastName: string;
  username: string;
  age: string;
  education: string;
  nationalId: number;
  phone: string;
  address: string;
  email: string;
  id: string;
}

export const placeholders: Record<string, string> = {
  firstName: "نام",
  lastName: "نام خانوادگی",
  phone: "شماره تماس",
  address: "آدرس",
  age: "تاریخ تولد",
  education: "تحصیلات",
};
