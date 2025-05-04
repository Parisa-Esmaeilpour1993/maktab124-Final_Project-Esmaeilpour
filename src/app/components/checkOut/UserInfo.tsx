"use client";
import {
  adminLocalization,
  checkOutLocalization,
} from "@/app/constants/localization/fa/localization";
import { Input } from "@/app/shared/Input";
import { UserInfoProps } from "@/app/types/UserInfo";
import React, { useState } from "react";

interface ExtendedUserInfoProps extends UserInfoProps {
  isReceiverOther: boolean;
}

const UserInfo: React.FC<ExtendedUserInfoProps> = ({
  userInfo,
  setUserInfo,
  setSelectedAddress,
  isReceiverOther,
}) => {
  const [selectedAddressIndex, setSelectedAddressIndex] = useState<
    number | null
  >(null);
  const [newAddress, setNewAddress] = useState("");

  return (
    <div className="p-6 border rounded-xl shadow-accent space-y-4">
      <div className="flex gap-2 items-center mb-4">
        <h2 className="text-lg font-semibold">
          {checkOutLocalization.userInformation}
        </h2>
        <span className="text-sm text-gray-500">
          {checkOutLocalization.addAddress}
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Input
          type="text"
          placeholder={adminLocalization.firstName}
          value={userInfo.firstName}
          onChange={(e) =>
            setUserInfo({ ...userInfo, firstName: e.target.value })
          }
          title={adminLocalization.firstName}
          readOnly={!isReceiverOther}
        />
        <Input
          type="text"
          placeholder={adminLocalization.lastName}
          value={userInfo.lastName}
          onChange={(e) =>
            setUserInfo({ ...userInfo, lastName: e.target.value })
          }
          title={adminLocalization.lastName}
          readOnly={!isReceiverOther}
        />
        <Input
          type="text"
          placeholder={adminLocalization.phone}
          value={userInfo.phone}
          onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
          title={adminLocalization.phone}
          readOnly={!isReceiverOther}
        />
      </div>
      <div className="space-y-2">
        <div className="flex flex-col md:flex-row items-center gap-2">
          <h3 className="font-bold">{checkOutLocalization.chooseAddress}</h3>
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

        {isReceiverOther && (
          <div className="mt-4">
            <Input
              type="text"
              placeholder="آدرس جدید را وارد کنید"
              value={newAddress}
              onChange={(e) => setNewAddress(e.target.value)}
              title="آدرس جدید"
            />
            <button
              type="button"
              className="mt-2 px-4 py-2 bg-primary text-white rounded hover:bg-secondary"
              onClick={() => {
                if (!newAddress.trim()) return;
                const updatedAddresses = [
                  ...userInfo.addresses,
                  { value: newAddress.trim() },
                ];
                setUserInfo({ ...userInfo, addresses: updatedAddresses });
                setSelectedAddress(newAddress.trim());
                setSelectedAddressIndex(updatedAddresses.length - 1);
                setNewAddress("");
              }}
            >
              افزودن آدرس
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserInfo;
