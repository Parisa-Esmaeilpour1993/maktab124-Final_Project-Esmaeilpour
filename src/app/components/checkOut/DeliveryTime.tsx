"use client";
import { checkOutLocalization } from "@/app/constants/localization/fa/localization";
import { faIR } from "date-fns/locale";
import moment from "jalali-moment";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CiCalendarDate } from "react-icons/ci";

interface Props {
  deliveryTime: Date | null;
  setDeliveryTime: (date: Date | null) => void;
}
function DeliveryTime({ deliveryTime, setDeliveryTime }: Props) {
  const [shamsiDate, setShamsiDate] = useState("");
  const [dayOfWeek, setDayOfWeek] = useState("");
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  useEffect(() => {
    if (deliveryTime) {
      const m = moment(deliveryTime).locale("fa");
      setShamsiDate(m.format("YYYY/MM/DD"));
      setDayOfWeek(m.format("dddd"));
    } else {
      setShamsiDate("");
      setDayOfWeek("");
    }
  }, [deliveryTime]);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  return (
    <div className="p-6 border rounded-xl shadow-accent space-y-4">
      <h2 className="text-lg font-semibold">{checkOutLocalization.time}</h2>

      {deliveryTime && !isPickerOpen ? (
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-700">
            <span>
              {dayOfWeek} - {shamsiDate}
            </span>
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
          selected={deliveryTime}
          onChange={(date) => {
            setDeliveryTime(date);
            setIsPickerOpen(false);
          }}
          minDate={tomorrow}
          dateFormat="yyyy/MM/dd"
          locale={faIR}
          className="p-2 rounded w-full border"
          placeholderText="تاریخ را انتخاب کنید"
        />
      )}
    </div>
  );
}

export default DeliveryTime;
