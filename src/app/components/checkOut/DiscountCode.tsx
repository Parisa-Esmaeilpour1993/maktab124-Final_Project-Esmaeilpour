import {
  checkOutLocalization,
  faLocalization,
} from "@/app/constants/localization/fa/localization";
import Button from "@/app/shared/Button";
import { Input } from "@/app/shared/Input";
import { DiscountCodeProps, OffTicket } from "@/app/types/offTickets";
import { useState } from "react";
import { toast } from "react-toastify";

function DiscountCode({
  setValidDiscount,
  offTickets,
  calculateTotalPrice,
}: DiscountCodeProps) {
  const [discountCode, setDiscountCode] = useState("");

  const handleDiscountCheck = () => {
    const ticket = (offTickets as OffTicket[]).find(
      (ticket) => ticket.name === discountCode.trim()
    );
    if (!ticket) {
      setValidDiscount(0);
      toast.error(checkOutLocalization.invalidDiscount);
      return;
    }

    const totalPrice = calculateTotalPrice();

    if (totalPrice >= ticket.discountMinOrder) {
      setValidDiscount(ticket.discount || 0);
      toast.success(checkOutLocalization.applyDiscount);
    } else {
      setValidDiscount(0);
      toast.error(
        `${
          checkOutLocalization.minOrderAmount
        } ${ticket.discountMinOrder.toLocaleString()} ${faLocalization.rial}`
      );
    }
  };
  return (
    <div className="p-6 border rounded-xl shadow-accent space-y-4">
      <h2 className="text-lg font-semibold mb-4">
        {checkOutLocalization.discountCode}
      </h2>
      <div className="flex gap-4">
        <Input
          type="text"
          placeholder={checkOutLocalization.discountCode}
          value={discountCode}
          onChange={(e) => setDiscountCode(e.target.value)}
        />
        <Button
          children={checkOutLocalization.apply}
          onClick={() => handleDiscountCheck()}
        />
        <Button
          children={checkOutLocalization.delete}
          className="!bg-gray-400 hover:!bg-gray-500"
          onClick={() => {
            setDiscountCode("");
            setValidDiscount(0);
            toast.info(checkOutLocalization.discountRemoved);
          }}
        />
      </div>
    </div>
  );
}

export default DiscountCode;
