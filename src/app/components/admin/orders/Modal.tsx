"use client";
import { getAuthToken } from "@/app/base/getAuthToken";
import { API_KEY, BASE_url } from "@/app/constants/api/BASE_URL";
import {
  adminLocalization,
  cartLocalization,
  checkOutLocalization,
  dashboardLocalization,
  discountLocalization,
  ordersLocalization,
  productsLocalization,
  sweetAlert,
} from "@/app/constants/localization/fa/localization";
import { Input } from "@/app/shared/Input";
import { Order } from "@/app/types/orders";
import axios from "axios";
import React from "react";
import { AiFillCloseSquare } from "react-icons/ai";
import { toast } from "react-toastify";

type ModalProps = {
  selectedOrder: Order;
  setSelectedOrder: (order: Order | null) => void;
  deliveryDate: string;
  setDeliveryDate: React.Dispatch<React.SetStateAction<string>>;
  editStatus: boolean | null;
  setEditStatus: React.Dispatch<React.SetStateAction<boolean | null>>;
  isModified: boolean;
  setIsModified: React.Dispatch<React.SetStateAction<boolean>>;
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
};

function Modal({
  selectedOrder,
  setSelectedOrder,
  deliveryDate,
  setDeliveryDate,
  editStatus,
  setEditStatus,
  isModified,
  setIsModified,
  orders,
  setOrders,
}: ModalProps) {
  const token = getAuthToken();

  const handleSaveChanges = async () => {
    if (!selectedOrder) return;

    try {
      await axios.put(
        `${BASE_url}/api/records/orders/${selectedOrder.id}`,
        {
          deliveryDate: deliveryDate,
          isDelivered: editStatus,
        },
        {
          headers: {
            "Content-Type": "application/json",
            api_key: API_KEY,
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedOrders = orders?.map((order) =>
        order.id === selectedOrder.id
          ? {
              ...order,
              deliveryDate,
              deliveryStatus: editStatus ?? false,
            }
          : order
      );

      setOrders(updatedOrders);
      setIsModified(false);
      setSelectedOrder(null);
      toast.success(sweetAlert.successfullyEdited);
    } catch (err) {
      toast.error(sweetAlert.error);
      console.error(err);
    }
  };

  const handleDeleteOrder = async (id: string) => {
    try {
      await axios.delete(`${BASE_url}/api/records/orders/${id}`, {
        headers: { api_key: API_KEY },
      });
      setOrders((prev) => prev?.filter((order) => order.id !== id));
      setSelectedOrder(null);
      toast.success(sweetAlert.successfullyDeleted);
    } catch (err) {
      toast.error(sweetAlert.error);
      console.error(err);
    }
  };

  const handleDeliveryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDeliveryDate(e.target.value);
    setIsModified(true);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-6 md:px-12">
      <div className="flex flex-col gap-4 bg-white p-3 md:p-6 rounded-lg w-full shadow-lg max-h-screen overflow-y-auto">
        <div className="flex items-center justify-between">
          <h2 className="md:text-lg font-semibold text-gray-700">
            {ordersLocalization.ordersDetail} {selectedOrder.id}
          </h2>
          <button onClick={() => setSelectedOrder(null)}>
            <AiFillCloseSquare size={24} className="text-gray-700" />
          </button>
        </div>

        <div className="flex flex-col gap-2 lg:flex-row lg:gap-8 items-center text-[15px]">
          <p className="text-gray-700">
            <strong>{ordersLocalization.customer}:</strong>{" "}
            <span className="text-secondary">{selectedOrder.customer}</span>
          </p>
          <p className="text-gray-700">
            <strong>{adminLocalization.address}:</strong>{" "}
            <span className="text-secondary">{selectedOrder.address}</span>
          </p>
          <p className="text-gray-700">
            <strong> {adminLocalization.phone}:</strong>{" "}
            <span className="text-secondary">{selectedOrder.phone}</span>
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-8">
          <div className="flex flex-col gap-2 md:flex-row items-center">
            <p className="text-gray-700 font-medium">
              {ordersLocalization.status}:
            </p>
            <div className="border border-accent px-1 rounded-md">
              <select
                value={
                  editStatus
                    ? ordersLocalization.delivered
                    : ordersLocalization.inDelivery
                }
                onChange={(e) => {
                  const newVal =
                    e.target.value === ordersLocalization.delivered;
                  setEditStatus(newVal);
                  setIsModified(true);
                  if (!newVal) {
                    setDeliveryDate("");
                  }
                }}
                className="border-none max-w-fit rounded p-1 text-secondary outline-none"
              >
                <option value={ordersLocalization.inDelivery}>
                  {ordersLocalization.inDelivery}
                </option>
                <option value={ordersLocalization.delivered}>
                  {ordersLocalization.delivered}
                </option>
              </select>
            </div>
          </div>

          {editStatus && (
            <div className="flex flex-col gap-2 md:flex-row items-center">
              <strong className="text-gray-700 font-medium">
                {ordersLocalization.deliveryTime}:
              </strong>
              <Input
                type="datetime-local"
                value={deliveryDate || ""}
                onChange={handleDeliveryDateChange}
              />
            </div>
          )}
        </div>

        <h3 className="text-lg font-semibold text-gray-700 mt-2">
          {ordersLocalization.ordersProducts}:
        </h3>

        <div className="hidden md:block rounded border border-accent bg-white max-h-36 overflow-y-auto">
          <table className="min-w-full text-sm text-gray-700">
            <thead className="bg-accent text-xs font-semibold text-gray-600 sticky top-0">
              <tr>
                <th className="px-3 py-2 text-right">
                  {" "}
                  {productsLocalization.productName}
                </th>
                <th className="px-3 py-2 text-center">
                  {productsLocalization.number}
                </th>
                <th className="px-3 py-2 text-center">
                  {cartLocalization.pricePerProduct}(
                  {dashboardLocalization.rial})
                </th>
                <th className="px-3 py-2 text-center">
                  {productsLocalization.discount} (%)
                </th>
                <th className="px-3 py-2 text-center">
                  {cartLocalization.totalPrice}({dashboardLocalization.rial})
                </th>
              </tr>
            </thead>
            <tbody>
              {selectedOrder.items.map((item, index) => (
                <tr key={index} className="border-t border-accent">
                  <td className="px-3 py-2">{item.name}</td>
                  <td className="px-3 py-2 text-center">{item.quantity}</td>
                  <td className="px-3 py-2 text-center">
                    {item.unitPrice.toLocaleString()}
                  </td>
                  <td className="px-3 py-2 text-center">
                    {item.discountPercent}
                  </td>
                  <td className="px-3 py-2 text-center">
                    {item.price.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="md:hidden flex flex-col gap-4 overflow-y-auto max-h-36 shadow-accent p-2">
          {selectedOrder.items.map((item, index) => (
            <div
              key={index}
              className="border border-accent rounded p-3 bg-white shadow-sm text-sm"
            >
              <p>
                <strong>{productsLocalization.productName}:</strong> {item.name}
              </p>
              <p>
                <strong>{productsLocalization.number}:</strong> {item.quantity}
              </p>
              <p>
                <strong>{cartLocalization.pricePerProduct}:</strong>{" "}
                {item.unitPrice.toLocaleString()} {dashboardLocalization.rial}
              </p>
              <p>
                <strong>{productsLocalization.discount}:</strong>{" "}
                {item.discountPercent}%
              </p>
              <p>
                <strong>{cartLocalization.totalPrice}:</strong>{" "}
                {item.price.toLocaleString()} {dashboardLocalization.rial}
              </p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2 md:gap-4 mt-4 text-sm text-gray-700">
          <div className="bg-light/40 p-3 rounded shadow-sm">
            <strong>{checkOutLocalization.deliveryMethod} :</strong>{" "}
            {selectedOrder.deliveryMethods.name} -{" "}
            {selectedOrder.deliveryMethods.cost.toLocaleString()}{" "}
            {dashboardLocalization.rial}
          </div>

          <div className="bg-light/40 p-3 rounded shadow-sm">
            <strong>{ordersLocalization.finalShippingCost}</strong>{" "}
            {selectedOrder.finalShippingCost.toLocaleString()}{" "}
            {dashboardLocalization.rial}
          </div>

          <div className="bg-light/40 p-3 rounded shadow-sm">
            <strong>{checkOutLocalization.discountCode}:</strong>{" "}
            {selectedOrder.discountCode || "—"}
          </div>

          <div className="bg-light/40 p-3 rounded shadow-sm">
            <strong>{discountLocalization.discount} :</strong>{" "}
            {selectedOrder.validDiscount.toLocaleString()}{" "}
            {dashboardLocalization.rial}
          </div>

          <div className="bg-light/40 p-3 rounded shadow-sm">
            <strong>{ordersLocalization.lastPrice}</strong>{" "}
            {selectedOrder.totalPrice.toLocaleString()}{" "}
            {dashboardLocalization.rial}
          </div>

          <div className="bg-light/40 p-3 rounded shadow-sm">
            <strong>{ordersLocalization.sum}:</strong>{" "}
            {selectedOrder.finalAmount.toLocaleString()}{" "}
            {dashboardLocalization.rial}
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleSaveChanges}
            className={`w-full bg-secondary text-white p-2 rounded hover:bg-primary transition ${
              !isModified ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={!isModified}
          >
            {ordersLocalization.saveChanges}
          </button>
          <button
            onClick={() => handleDeleteOrder(selectedOrder.id)}
            className="w-full bg-red-600 text-white p-2 rounded hover:bg-red-700 transition"
          >
            {ordersLocalization.deleteOrder}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Modal;
