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
import axios from "axios";
import html2pdf from "html2pdf.js";
import React, { useState } from "react";
import { AiFillCloseSquare } from "react-icons/ai";
import { toast } from "react-toastify";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { CiCalendarDate } from "react-icons/ci";
import DateObject from "react-date-object";
import { OrderRecord } from "@/app/types/orders";

type ModalProps = {
  selectedOrder: OrderRecord;
  setSelectedOrder: (order: OrderRecord | null) => void;
  deliveryDate: string;
  setDeliveryDate: React.Dispatch<React.SetStateAction<string>>;
  editStatus: boolean | null;
  setEditStatus: React.Dispatch<React.SetStateAction<boolean | null>>;
  isModified: boolean;
  setIsModified: React.Dispatch<React.SetStateAction<boolean>>;
  orders: OrderRecord[];
  setOrders: React.Dispatch<React.SetStateAction<OrderRecord[]>>;
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
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

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

  const exportToPDF = () => {
    const content = document.getElementById("modal-content");
    if (!content) return;

    const originalMaxHeight = content.style.maxHeight;
    const originalOverflow = content.style.overflow;

    content.style.maxHeight = "none";
    content.style.overflow = "visible";

    content.classList.add("pdf-export-style");

    const opt = {
      margin: 0.5,
      filename: "order-details.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "landscape" },
    };

    html2pdf()
      .set(opt)
      .from(content)
      .save()
      .then(() => {
        content.style.maxHeight = originalMaxHeight;
        content.style.overflow = originalOverflow;
        content.classList.remove("pdf-export-style");
      });
  };

  console.log(selectedOrder);
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-6 md:px-12">
      <div className="flex flex-col gap-4 bg-white p-3 md:p-6 rounded-lg w-full shadow-lg max-h-[90vh] overflow-y-auto">
        <div id="modal-content" className="flex flex-col gap-4 mb-2">
          <div className="flex items-center justify-between">
            <h2 className="md:text-lg font-semibold text-gray-700">
              {ordersLocalization.ordersDetail} {selectedOrder.id}
            </h2>
            <button onClick={() => setSelectedOrder(null)}>
              <AiFillCloseSquare size={24} className="text-gray-700" />
            </button>
          </div>

          <div className="flex flex-col gap-2 lg:flex-row lg:gap-8 text-[15px]">
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

          <div className="flex flex-col md:flex-row items-start lg:items-center gap-2 md:gap-8">
            <div className="flex gap-2 items-center">
              <p className="text-gray-700 font-medium">
                {ordersLocalization.status}:
              </p>
              <div className="border border-accent px-1 md:py-[1px] rounded-md mr-6 md:mr-0">
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
                  className="border-none max-w-fit rounded text-secondary outline-none"
                >
                  <option
                    value={ordersLocalization.inDelivery}
                    className="text-[10px] xl:text-sm"
                  >
                    {ordersLocalization.inDelivery}
                  </option>
                  <option
                    value={ordersLocalization.delivered}
                    className="text-[10px] xl:text-sm"
                  >
                    {ordersLocalization.delivered}
                  </option>
                </select>
              </div>
            </div>

            {editStatus && (
              <div className="flex gap-2 items-center">
                <h3 className="text-gray-700 font-medium">
                  {ordersLocalization.deliveryTime}:
                </h3>
                <div className="flex flex-col lg:flex-row gap-2 items-center">
                  {deliveryDate && !isPickerOpen ? (
                    <div className="flex items-center gap-4">
                      <div className="text-sm text-gray-700">
                        <span dir="ltr">{deliveryDate}</span>
                      </div>
                      <button
                        className="text-primary text-xl"
                        onClick={() => setIsPickerOpen(true)}
                      >
                        <CiCalendarDate />
                      </button>
                    </div>
                  ) : (
                    <DatePicker
                      value={
                        deliveryDate
                          ? new DateObject({
                              date: deliveryDate,
                              format: "YYYY/MM/DD",
                            })
                          : ""
                      }
                      onChange={(dateObj) => {
                        if (dateObj) {
                          setDeliveryDate(dateObj.format("YYYY/MM/DD"));
                          setIsModified(true);
                        }
                      }}
                      calendar={persian}
                      minDate={tomorrow}
                      locale={persian_fa}
                      className="p-2 rounded-md w-full"
                      inputClass="w-full p-1 rounded-md border border-gray-300 focus:ring-1 focus:ring-accent outline-none text-secondary"
                      placeholder={checkOutLocalization.chooseDate}
                    />
                  )}
                </div>
              </div>
            )}
          </div>

          <h3 className="text-lg font-semibold text-gray-700 mt-2">
            {ordersLocalization.ordersProducts}:
          </h3>

          <div className="hidden md:block rounded border border-accent bg-white">
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
                {selectedOrder?.items?.map((item, index) => (
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

          <div className="md:hidden flex flex-col gap-4 shadow-accent p-2">
            {selectedOrder?.items?.map((item, index) => (
              <div
                key={index}
                className="border border-accent rounded p-3 bg-white shadow-sm text-sm"
              >
                <p>
                  <strong>{productsLocalization.productName}:</strong>{" "}
                  {item.name}
                </p>
                <p>
                  <strong>{productsLocalization.number}:</strong>{" "}
                  {item.quantity}
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
              {selectedOrder.deliveryMethod?.name} -{" "}
              {selectedOrder.deliveryMethod?.cost.toLocaleString()}{" "}
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
            onClick={exportToPDF}
            className="hidden lg:block w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
          >
            خروجی PDF
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
