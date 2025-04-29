import {
  cartLocalization,
  checkOutLocalization,
  faLocalization,
} from "@/app/constants/localization/fa/localization";
import { CartSummaryProps } from "@/app/types/cart";
import React from "react";

function CartSummary({ items }: CartSummaryProps) {
  return (
    <div className="p-6 border rounded-xl shadow-accent space-y-6">
      <h2 className="text-lg font-semibold mb-4">
        {cartLocalization.orderDetail}
      </h2>

      <div className="hidden md:block overflow-y-auto max-h-64">
        <table className="w-full text-center rounded-xl">
          <thead className="bg-primary text-white text-xs lg:text-[16px]">
            <tr>
              <th className="p-2">{checkOutLocalization.name}</th>
              <th className="p-2">{checkOutLocalization.pricePerItem}</th>
              <th className="p-2">{checkOutLocalization.count}</th>
              <th className="p-2">{checkOutLocalization.discountPercent}</th>
              <th className="p-2">{checkOutLocalization.finalPrice}</th>
              <th className="p-2">{checkOutLocalization.payablePrice}</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const originalPrice = item.productPrice * item.quantity;
              const discountedPrice =
                item.productPrice *
                (1 - item.discountPercent / 100) *
                item.quantity;
              return (
                <tr
                  key={item.id}
                  className="border-t md:text-xs lg:text-[15px]"
                >
                  <td className="p-2">{item.productName}</td>
                  <td className="p-2">
                    {item.productPrice.toLocaleString()} {faLocalization.rial}
                  </td>
                  <td className="p-2">{item.quantity}</td>
                  <td className="p-2">{item.discountPercent}%</td>
                  <td className="p-2 text-gray-600">
                    {originalPrice.toLocaleString()} {faLocalization.rial}
                  </td>
                  <td className="p-2 font-bold text-primary">
                    {discountedPrice.toLocaleString()} {faLocalization.rial}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {items.map((item) => (
        <div
          key={item.id}
          className="flex flex-col gap-2 border-b pb-2 items-center justify-between md:hidden"
        >
          <div>
            {item.productName} × {item.quantity}
          </div>
          <div>
            {item.discountPercent > 0 ? (
              <div className="flex items-center justify-center gap-4">
                <span className="line-through text-gray-400 text-sm">
                  {(item.productPrice * item.quantity).toLocaleString()} ریال
                </span>
                <span className="font-semibold text-primary">
                  {(
                    item.productPrice *
                    (1 - item.discountPercent / 100) *
                    item.quantity
                  ).toLocaleString()}{" "}
                  ریال
                </span>
              </div>
            ) : (
              <span className="font-semibold text-primary">
                {(item.productPrice * item.quantity).toLocaleString()}{" "}
                {faLocalization.rial}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default CartSummary;
