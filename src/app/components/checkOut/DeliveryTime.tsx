"use client";
import { checkOutLocalization } from "@/app/constants/localization/fa/localization";
import { Input } from "@/app/shared/Input";
import moment from "jalali-moment";
import React, { useState } from "react";

function DeliveryTime() {
  const [selectedDate, setSelectedDate] = useState("");
  const [shamsiDate, setShamsiDate] = useState("");
  const [dayOfWeek, setDayOfWeek] = useState("");

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value;
    setSelectedDate(date);

    if (date) {
      const m = moment(date, "YYYY-MM-DD").locale("fa");
      setShamsiDate(m.format("YYYY/MM/DD"));
      setDayOfWeek(m.format("dddd"));
    } else {
      setShamsiDate("");
      setDayOfWeek("");
    }
  };

  return (
    <div className="p-6 border rounded-xl shadow-accent space-y-4">
      <h2 className="text-lg font-semibold mb-4">
        {checkOutLocalization.time}
      </h2>
      <div className="flex items-center gap-8">
        <div className="flex gap-4">
          <Input type="date" value={selectedDate} onChange={handleDateChange} />
        </div>
        {shamsiDate && (
          <div className="text-sm text-gray-600">
            {dayOfWeek} - {shamsiDate}
          </div>
        )}
      </div>
    </div>
  );
}

export default DeliveryTime;
