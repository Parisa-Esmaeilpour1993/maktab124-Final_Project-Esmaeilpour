import {
  dashboardLocalization,
  faLocalization,
  ordersLocalization,
} from "@/app/constants/localization/fa/localization";
import { Order } from "@/app/types/orders";
import React from "react";

type Props = {
  filteredOrders: Order[];
  setSelectedOrder: (order: Order) => void;
};

function OrderTabel({ filteredOrders, setSelectedOrder }: Props) {
  return (
    <div className="w-5/6 md:w-full overflow-x-auto">
      <table className="w-full border text-center text-xs md:text-sm lg:text-[15px]">
        <thead>
          <tr className="bg-light">
            <th className="p-2 border border-accent">
              {ordersLocalization.id}
            </th>
            <th className="p-2 border border-accent">
              {ordersLocalization.customer}
            </th>
            <th className="p-2 border border-accent">
              {ordersLocalization.createdAt}
            </th>
            <th className="p-2 border border-accent">
              {ordersLocalization.totalPrice}
            </th>
            <th className="p-2 border border-accent">
              {ordersLocalization.status}
            </th>
            <th className="p-2 border border-accent">
              {ordersLocalization.detail}
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders?.map((order) => (
            <tr key={order.id} className="border-t">
              <td className="p-2 border border-accent">{order.id}</td>
              <td className="p-2 border border-accent">{order.customer}</td>
              <td className="p-2 border border-accent">
                {new Date(order.createdAt).toLocaleString("fa-IR")}
              </td>
              <td className="p-2 border border-accent">
                {order.totalPrice.toLocaleString()} {dashboardLocalization.rial}
              </td>
              <td className="p-2 border border-accent">
                {order.deliveryStatus
                  ? ordersLocalization.delivered
                  : ordersLocalization.inDelivery}
              </td>
              <td className="p-2 border border-accent">
                <button
                  className="text-secondary hover:text-primary underline"
                  onClick={() => setSelectedOrder(order)}
                >
                  {faLocalization.show}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default OrderTabel;
