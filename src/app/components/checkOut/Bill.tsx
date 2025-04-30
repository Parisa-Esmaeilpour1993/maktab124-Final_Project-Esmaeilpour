import {
  checkOutLocalization,
  faLocalization,
} from "@/app/constants/localization/fa/localization";
import { DeliveryMethod } from "@/app/types/deliveryMethods";

type FinalPriceProps = {
  selectedDelivery: DeliveryMethod | null;
  calculateTotalPrice: () => number;
  validDiscount: number;
};

function Bill({
  validDiscount,
  calculateTotalPrice,
  selectedDelivery,
}: FinalPriceProps) {
  const isFreeShipping = (
    totalPrice: number,
    deliveryMethod: DeliveryMethod
  ) => {
    return totalPrice >= deliveryMethod.freeShippingOver;
  };

  const finalShippingCost =
    selectedDelivery && isFreeShipping(calculateTotalPrice(), selectedDelivery)
      ? 0
      : selectedDelivery?.minCost || 0;
  return (
    <div className="flex flex-col gap-3 font-bold p-6 border rounded-xl shadow-accent">
      <div className="flex justify-between items-center">
        <span className=" font-semibold">
          {checkOutLocalization.finalPrice} :
        </span>
        <span className="text-primary">
          {calculateTotalPrice().toLocaleString()} {faLocalization.rial}
        </span>
      </div>
      <div className="flex justify-between items-center">
        <span className=" font-semibold">
          {checkOutLocalization.deliveryCost} :
        </span>
        <span className="text-primary">
          {selectedDelivery &&
          isFreeShipping(calculateTotalPrice(), selectedDelivery)
            ? checkOutLocalization.freeDelivery
            : (selectedDelivery?.minCost || 0).toLocaleString() +
              " " +
              faLocalization.rial}
        </span>
      </div>
      <div className="flex justify-between items-center">
        <span className=" font-semibold">
          {" "}
          {checkOutLocalization.discountCode} :
        </span>
        <span className="text-primary">
          {validDiscount.toLocaleString()} {faLocalization.rial}
        </span>
      </div>
      <div className="flex justify-between items-center border-t mt-2 pt-3">
        <span className=" font-semibold">
          {" "}
          {checkOutLocalization.payablePrice} :
        </span>
        <span className="text-primary">
          {(
            calculateTotalPrice() +
            finalShippingCost -
            validDiscount
          ).toLocaleString()}{" "}
          {faLocalization.rial}
        </span>
      </div>
    </div>
  );
}

export default Bill;
