"use client";
import {
  adminLocalization,
  checkOutLocalization,
} from "@/app/constants/localization/fa/localization";
import { Input } from "@/app/shared/Input";
import { UserInfoProps } from "@/app/types/UserInfo";
import React, { useState } from "react";

const UserInfo: React.FC<UserInfoProps> = ({
  userInfo,
  setUserInfo,
  setSelectedAddress,
}) => {
  const [selectedAddressIndex, setSelectedAddressIndex] = useState<
    number | null
  >(null);

  return (
    <div className="p-6 border rounded-xl shadow-accent space-y-4">
      <h2 className="text-lg font-semibold mb-4">
        {checkOutLocalization.userInformation}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Input
          type="text"
          placeholder={adminLocalization.firstName}
          value={userInfo.firstName}
          onChange={(e) =>
            setUserInfo({ ...userInfo, firstName: e.target.value })
          }
          title={adminLocalization.firstName}
        />
        <Input
          type="text"
          placeholder={adminLocalization.lastName}
          value={userInfo.lastName}
          onChange={(e) =>
            setUserInfo({ ...userInfo, lastName: e.target.value })
          }
          title={adminLocalization.lastName}
        />
        <Input
          type="text"
          placeholder={adminLocalization.phone}
          value={userInfo.phone}
          onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
          title={adminLocalization.phone}
        />
      </div>
      <div className="space-y-2">
        <div className="flex flex-col md:flex-row items-center gap-2">
          <h3 className="font-bold">آدرس را انتخاب کنید:</h3>{" "}
          <span className="text-sm text-gray-500">
            (برای افزودن آدرس جدید به بخش پروفایل کاربری مراجعه کتید.)
          </span>
        </div>
        {userInfo.addresses.map((addr, index) => (
          <label key={index} className="flex items-center gap-2">
            <input
              type="radio"
              name="selectedAddress"
              checked={selectedAddressIndex === index}
              onChange={() => {
                setSelectedAddressIndex(index);
                setSelectedAddress(userInfo.addresses[index].value);
              }}
              className="accent-green-700"
            />
            <span>{addr.value}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default UserInfo;
