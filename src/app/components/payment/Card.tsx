"use client";
import React from "react";
import { MdPayments } from "react-icons/md";

export interface PaymentFormData {
  cardName: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  secondPassword: string;
}
const Input = ({ formData }: { formData: PaymentFormData }) => {
  return (
    <div className="flex flex-col justify-around bg-primary p-8 border border-white border-opacity-30 rounded-lg shadow-primary">
      <div className="flex gap-2 items-center justify-between mb-3">
        <div className="flex items-center justify-center">
          <MdPayments size={24} />
        </div>
        <input
          className="max-w-fit bg-primary border-none outline-none  text-white caret-green-500 flex-grow p-2 rounded-md"
          dir="ltr"
          type="text"
          name="cardName"
          placeholder="نام و نام خانوادگی"
          value={formData.cardName}
          readOnly
        />
      </div>
      <div className="flex flex-col space-y-3">
        <input
          className="w-full border-none outline-none  caret-green-500 text-white bg-primary rounded-md p-2"
          dir="ltr"
          type="text"
          name="cardNumber"
          placeholder="0000 0000 0000 0000"
          value={formData.cardNumber}
          readOnly
        />
        <div className="flex justify-between pt-8">
          <div className="flex flex-col">
            <label className="text-xs text-gray-800 ">رمز cvv2</label>
            <input
              className="w-20 border-none outline-none   caret-green-500 text-white bg-primary rounded-md p-2"
              type="text"
              name="cvv"
              placeholder="****"
              value={formData.cvv}
              readOnly
            />
          </div>
          <div className="flex flex-col text-left">
            <label className="text-xs text-gray-800 pl-3">تاریخ انقضا</label>
            <input
              className="border-none outline-none  caret-green-500 text-white bg-primary rounded-md p-2"
              dir="ltr"
              type="text"
              name="expiryDate"
              placeholder="ماه / سال"
              value={formData.expiryDate}
              readOnly
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Input;
