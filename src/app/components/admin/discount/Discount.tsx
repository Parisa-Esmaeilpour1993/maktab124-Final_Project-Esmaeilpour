"use client";

import { getAuthToken } from "@/app/base/getAuthToken";
import { API_KEY, BASE_url } from "@/app/constants/api/BASE_URL";
import {
  discountLocalization,
  faLocalization,
  sweetAlert,
} from "@/app/constants/localization/fa/localization";
import Button from "@/app/shared/Button";
import { Input } from "@/app/shared/Input";
import { confirmDelete, successDelete } from "@/app/utils/sweetAlert";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import Pagination from "../products/Pagination";

interface OffTicket {
  id: number;
  name: string;
  discount: number;
  discountMinOrder: number;
}

export default function Discount() {
  const [tickets, setTickets] = useState<OffTicket[]>([]);
  const [name, setName] = useState("");
  const [discount, setDiscount] = useState<number>(0);
  const [discountMinOrder, setDiscountMinOrder] = useState<number>(0);
  const [editId, setEditId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const token = getAuthToken();

  const totalTickets = Math.ceil(tickets.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedTickets = tickets.slice(startIndex, endIndex);

  const fetchTickets = async () => {
    try {
      const { data } = await axios.get(`${BASE_url}/api/records/offTickets`, {
        headers: {
          "Content-Type": "application/json",
          api_key: API_KEY,
          Authorization: `Bearer ${token}`,
        },
      });
      setTickets(data.records);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async () => {
    if (!name || discount <= 0 || discountMinOrder <= 0) {
      toast.error(discountLocalization.required);
      return;
    }

    try {
      if (editId !== null) {
        await axios.put(
          `${BASE_url}/api/records/offTickets/${editId}`,
          { name, discount, discountMinOrder },
          {
            headers: {
              "Content-Type": "application/json",
              api_key: API_KEY,
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.success(sweetAlert.successfullyEdited);
      } else {
        await axios.post(
          `${BASE_url}/api/records/offTickets`,
          { name, discount, discountMinOrder },
          {
            headers: {
              "Content-Type": "application/json",
              api_key: API_KEY,
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.success(sweetAlert.seccessfullyAdded);
      }
      setName("");
      setDiscount(0);
      setDiscountMinOrder(0);
      setEditId(null);
      await fetchTickets();

      const totalItemsAfterAdd = tickets.length + 1;
      const newLastPage = Math.ceil(totalItemsAfterAdd / itemsPerPage);
      setCurrentPage(newLastPage);
    } catch (error) {
      console.error(error);
      toast.error(sweetAlert.errorInSendingData);
    }
  };

  const handleEdit = (ticket: OffTicket) => {
    setName(ticket.name);
    setDiscount(ticket.discount);
    setDiscountMinOrder(ticket.discountMinOrder);
    setEditId(ticket.id);
  };

  const handleDelete = async (id: number) => {
    const confirm = await confirmDelete();
    if (confirm.isConfirmed) {
      try {
        await axios.delete(`${BASE_url}/api/records/offTickets/${id}`, {
          headers: {
            "Content-Type": "application/json",
            api_key: API_KEY,
            Authorization: `Bearer ${token}`,
          },
        });
        successDelete();
        fetchTickets();
        if (paginatedTickets.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      } catch (error) {
        console.error(error);
        toast.error(sweetAlert.errorInDeleteData);
      }
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  return (
    <div>
      <div className="p-6">
        <h1 className="text-xl font-bold mb-4">
          {discountLocalization.discountManage}
        </h1>

        <div className="flex gap-4 mb-6">
          <Input
            placeholder={discountLocalization.name}
            value={name}
            onChange={(e) => setName(e.target.value)}
            title={discountLocalization.name}
          />
          <Input
            type="number"
            placeholder={discountLocalization.discount}
            value={discount}
            onChange={(e) => setDiscount(Number(e.target.value))}
            title={discountLocalization.discount}
          />
          <Input
            type="number"
            placeholder={discountLocalization.minOrder}
            value={discountMinOrder}
            onChange={(e) => setDiscountMinOrder(Number(e.target.value))}
            title={discountLocalization.minOrder}
          />
          <Button onClick={handleSubmit}>
            {editId ? discountLocalization.edit : discountLocalization.add}
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 text-sm px-3 border">
                  {discountLocalization.num}
                </th>
                <th className="py-2 text-sm px-3 border">
                  {discountLocalization.name}
                </th>
                <th className="py-2 text-sm px-3 border">
                  {discountLocalization.discount}
                </th>
                <th className="py-2 text-sm px-3 border">
                  {discountLocalization.minOrder}
                </th>
                <th className="py-2 text-sm px-3 border">
                  {discountLocalization.operation}
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedTickets.map((ticket, index) => (
                <tr key={ticket.id} className="text-center">
                  <td className="py-2 text-sm px-3 border">
                    {startIndex + index + 1}
                  </td>
                  <td className="py-2 text-sm px-3 border">{ticket.name}</td>
                  <td className="py-2 text-sm px-3 border">
                    {ticket.discount.toLocaleString()} {faLocalization.rial}
                  </td>
                  <td className="py-2 text-sm px-3 border">
                    {ticket.discountMinOrder.toLocaleString()}
                    {faLocalization.rial}
                  </td>
                  <td className="py-2 text-sm px-3 border flex justify-center gap-2">
                    <Button onClick={() => handleEdit(ticket)}>
                      {faLocalization.edit}
                    </Button>
                    <Button onClick={() => handleDelete(ticket.id)}>
                      {faLocalization.delete}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {totalTickets > 1 && (
        <Pagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalTickets}
        />
      )}

      <ToastContainer />
    </div>
  );
}
