"use client";
import { checkOutLocalization } from "@/app/constants/localization/fa/localization";
import { useState } from "react";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import "react-multi-date-picker/styles/colors/teal.css";
import { CiCalendarDate } from "react-icons/ci";

interface Props {
  deliveryTime: Date | null;
  setDeliveryTime: (date: Date | null) => void;
}

function DeliveryTime({ deliveryTime, setDeliveryTime }: Props) {
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  return (
    <div className="p-6 border rounded-xl shadow-accent space-y-4">
      <h2 className="text-lg font-semibold">{checkOutLocalization.time}</h2>

      {deliveryTime && !isPickerOpen ? (
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-700">
            <span>{deliveryTime?.toLocaleString("fa-IR")}</span>
          </div>
          <button
            className="text-primary text-xl"
            onClick={() => setIsPickerOpen(true)}
          >
            <CiCalendarDate />
          </button>
        </div>
      ) : (
        <DatePicker
          value={deliveryTime}
          onChange={(date) => {
            setDeliveryTime(date?.toDate() || null);
            setIsPickerOpen(false);
          }}
          calendar={persian}
          minDate={tomorrow}
          locale={persian_fa}
          className="p-2 rounded-md w-full"
          placeholder={checkOutLocalization.chooseDate}
        />
      )}
    </div>
  );
}

export default DeliveryTime;
