"use client";

import {
  faLocalization,
  ordersLocalization,
} from "@/app/constants/localization/fa/localization";
import { fetchOrders } from "@/app/services/fetchOrders";
import { Input } from "@/app/shared/Input";
import SearchInput from "@/app/shared/SearchInput";
import { Order } from "@/app/types/orders";
import React, { useEffect, useState } from "react";
import OrderTabel from "./OrderTabel";
import Modal from "./Modal";

export default function Orders() {
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState<string>("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [deliveryDate, setDeliveryDate] = useState<string>("");
  const [isModified, setIsModified] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editStatus, setEditStatus] = useState<boolean | null>(null);

  useEffect(() => {
    const getData = async () => {
      setIsLoading(true);
      const data = await fetchOrders();
      setOrders(data);
      setIsLoading(false);
    };

    getData();
  }, []);

  useEffect(() => {
    if (selectedOrder) {
      setDeliveryDate(selectedOrder.deliveryDate || "");
      setEditStatus(selectedOrder.deliveryStatus);
      setIsModified(false);
    }
  }, [selectedOrder]);

  const filteredOrders = orders?.filter((order) => {
    const matchesFilter =
      filter === "all"
        ? true
        : order.deliveryStatus === (filter === "delivered");

    const matchesSearch = order.customer.includes(search.trim());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="p-2 md:p-4 w-full">
      <h1 className="w-4/5 md:w-full text-xl md:text-2xl font-bold mb-4 text-center text-primary">
        {ordersLocalization.ordersManagement}
      </h1>

      <div className="w-4/5 md:w-full flex flex-col lg:flex-row justify-between items-center gap-4 mb-6">
        <SearchInput
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={ordersLocalization.placeholder}
        />
        <div className="flex items-center justify-between gap-6 text-sm md:text-base">
          {["all", "delivered", "inDelivery"].map((status) => (
            <label key={status} className="flex gap-1 items-center">
              <Input
                type="radio"
                name="filter"
                checked={filter === status}
                onChange={() => setFilter(status)}
                className="accent-primary focus:outline-none focus:ring-0"
              />
              <span>
                {ordersLocalization[status as keyof typeof ordersLocalization]}
              </span>
            </label>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="text-center text-gray-500">
          {faLocalization.loading}
        </div>
      ) : (
        <OrderTabel
          filteredOrders={filteredOrders || []}
          setSelectedOrder={setSelectedOrder}
        />
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <Modal
          selectedOrder={selectedOrder}
          setSelectedOrder={setSelectedOrder}
          deliveryDate={deliveryDate}
          setDeliveryDate={setDeliveryDate}
          editStatus={editStatus}
          setEditStatus={setEditStatus}
          isModified={isModified}
          setIsModified={setIsModified}
          orders={orders}
          setOrders={setOrders}
        />
      )}
    </div>
  );
}
