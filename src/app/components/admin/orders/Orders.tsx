"use client";

import {
  faLocalization,
  ordersLocalization,
} from "@/app/constants/localization/fa/localization";
import { fetchOrders } from "@/app/services/fetchOrders";
import { Input } from "@/app/shared/Input";
import SearchInput from "@/app/shared/SearchInput";

import { OrderRecord } from "@/app/types/orders";
import { useEffect, useMemo, useState } from "react";
import Pagination from "../products/Pagination";
import Modal from "./Modal";
import OrderTabel from "./OrderTabel";

export default function Orders() {
  const [filter, setFilter] = useState<"all" | "delivered" | "inDelivery">(
    "all"
  );
  const [search, setSearch] = useState("");
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<OrderRecord | null>(null);
  const [deliveryDate, setDeliveryDate] = useState("");
  const [isModified, setIsModified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editStatus, setEditStatus] = useState<boolean | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

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

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesFilter =
        filter === "all"
          ? true
          : order.deliveryStatus === (filter === "delivered");

      const matchesSearch = order.customer
        .toLowerCase()
        .includes(search.trim().toLowerCase());

      return matchesFilter && matchesSearch;
    });
  }, [orders, filter, search]);

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
                onChange={() =>
                  setFilter(status as "all" | "delivered" | "inDelivery")
                }
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
      ) : filteredOrders.length === 0 ? (
        <div className="text-center text-gray-500">
          {ordersLocalization.noOrderFound}
        </div>
      ) : (
        <OrderTabel
          filteredOrders={paginatedOrders}
          setSelectedOrder={setSelectedOrder}
        />
      )}

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

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
        />
      )}
    </div>
  );
}
