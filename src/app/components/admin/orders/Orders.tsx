"use client";
import {
  dashboardLocalization,
  faLocalization,
  ordersLocalization,
} from "@/app/constants/localization/fa/localization";
import { Input } from "@/app/shared/Input";
import SearchInput from "@/app/shared/SearchInput";
import { Order } from "@/app/types/orders";
import { usersOrders } from "@/data";
import React, { useState } from "react";
import { AiFillCloseSquare } from "react-icons/ai";

export default function Orders() {
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState<string>("");
  const [orders, setOrders] = useState<Order[]>(usersOrders);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModified, setIsModified] = useState<boolean>(false);
  const [deliveryDate, setDeliveryDate] = useState<string>("");

  const filteredOrders = orders.filter((order) => {
    const matchesFilter =
      filter === "all"
        ? true
        : order.deliveryStatus === (filter === "delivered");

    const matchesSearch = order.id.includes(search.trim());
    return matchesFilter && matchesSearch;
  });

  const handleDeliveryStatusChange = (
    id: string,
    newDeliveryStatus: string
  ) => {
    const deliveryStatusBool =
      newDeliveryStatus === ordersLocalization.delivered;
    const updatedOrders = orders.map((order) =>
      order.id === id
        ? {
            ...order,
            deliveryStatus: deliveryStatusBool,
            deliveryDate: deliveryStatusBool
              ? deliveryDate || new Date().toISOString()
              : null,
          }
        : order
    );
    setOrders(updatedOrders);

    const updatedOrder = updatedOrders.find((order) => order.id === id);
    setSelectedOrder(updatedOrder || null);
    setIsModified(true);
  };

  const handleDeliveryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDeliveryDate(e.target.value);
    setIsModified(true);
  };

  const handleSaveChanges = () => {
    const updatedOrder = orders.find((order) => order.id === selectedOrder?.id);
    setSelectedOrder(updatedOrder || null);
    setIsModified(false);
    setSelectedOrder(null);
  };

  const handleDeleteOrder = (id: string) => {
    setOrders((prev) => prev.filter((order) => order.id !== id));
    setSelectedOrder(null);
  };

  return (
    <div className="p-4 w-full mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center text-primary">
        {ordersLocalization.ordersManagement}
      </h1>

      <div className="flex flex-col lg:flex-row justify-between items-center gap-4 mb-6">
        <SearchInput
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={ordersLocalization.placeholder}
        />
        <div className="flex gap-6 text-sm md:text-base">
          <label className="flex gap-1 items-center">
            <Input
              type="radio"
              name="filter"
              checked={filter === "all"}
              onChange={() => setFilter("all")}
              className="accent-primary  focus:!outline-none focus:!ring-0 focus:!ring-offset-0"
            />
            <span>{ordersLocalization.all}</span>
          </label>
          <label className="flex gap-1 items-center">
            <Input
              type="radio"
              name="filter"
              checked={filter === "delivered"}
              onChange={() => setFilter("delivered")}
              className="accent-primary  focus:!outline-none focus:!ring-0 focus:!ring-offset-0"
            />
            <span>{ordersLocalization.delivered}</span>
          </label>
          <label className="flex gap-1 items-center">
            <Input
              type="radio"
              name="filter"
              checked={filter === "inDelivery"}
              onChange={() => setFilter("inDelivery")}
              className="accent-primary  focus:!outline-none focus:!ring-0 focus:!ring-offset-0"
            />
            <span className="ml-2">{ordersLocalization.inDelivery}</span>
          </label>
        </div>
      </div>

      <div className="w-5/6 md:w-full overflow-x-auto mx-auto">
        <table className="w-full border text-center text-xs md:text-sm lg:text-base">
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
            {filteredOrders.map((order) => (
              <tr key={order.id} className="border-t">
                <td className="p-2 border border-accent">{order.id}</td>
                <td className="p-2 border border-accent">{order.customer}</td>
                <td className="p-2 border border-accent">
                  {new Date(order.createdAt).toLocaleString("fa-IR")}
                </td>
                <td className="p-2 border border-accent">
                  {order.totalPrice} {dashboardLocalization.rial}
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

      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
          <div className="flex flex-col gap-4 bg-white p-6 rounded-lg max-w-lg w-full shadow-lg">
            <div className="flex items-center justify-between">
              <h2 className="text-lg md:text-xl font-semibold text-gray-700 ">
                {ordersLocalization.ordersDetail}
                {selectedOrder.id}
              </h2>
              <button onClick={() => setSelectedOrder(null)}>
                <AiFillCloseSquare size={24} className="text-gray-700" />
              </button>
            </div>

            <p className="text-gray-700">
              <strong>{ordersLocalization.customer}:</strong>{" "}
              <span className="text-secondary">{selectedOrder.customer}</span>
            </p>
            <div>
              <p className="text-gray-700">
                <strong>{ordersLocalization.status}:</strong>
              </p>
              <select
                value={
                  selectedOrder.deliveryStatus
                    ? ordersLocalization.delivered
                    : ordersLocalization.inDelivery
                }
                onChange={(e) =>
                  handleDeliveryStatusChange(selectedOrder.id, e.target.value)
                }
                className="border rounded p-1 my-1 w-full text-secondary border-accent outline-none"
              >
                <option value={ordersLocalization.inDelivery}>
                  {ordersLocalization.inDelivery}
                </option>
                <option value={ordersLocalization.delivered}>
                  {ordersLocalization.delivered}
                </option>
              </select>
            </div>

            {selectedOrder.deliveryStatus && (
              <div>
                <strong className="text-gray-700">
                  {" "}
                  {ordersLocalization.deliveryTime}:{" "}
                </strong>
                <Input
                  type="datetime-local"
                  value={deliveryDate || selectedOrder.deliveryDate || ""}
                  onChange={handleDeliveryDateChange}
                />
              </div>
            )}

            <h3 className="text-lg font-semibold text-gray-700">
              {ordersLocalization.ordersProducts}:
            </h3>
            <div className="max-h-48 overflow-y-auto border rounded p-2 bg-light text-sm">
              <ul className="space-y-1">
                {selectedOrder.items.map((item, index) => (
                  <li key={index} className="border-b border-secondary pb-1">
                    {item.name} — {item.quantity} {ordersLocalization.item} ×{" "}
                    {item.price} {dashboardLocalization.rial}
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-center font-bold text-gray-700">
              {ordersLocalization.sum}: {selectedOrder.totalPrice}{" "}
              {dashboardLocalization.rial}
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
      )}
    </div>
  );
}
