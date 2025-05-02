"use client";

import { API_KEY, BASE_url } from "@/app/constants/api/BASE_URL";
import { faLocalization } from "@/app/constants/localization/fa/localization";
import axios from "axios";
import moment from "jalali-moment";
import { useEffect, useState } from "react";

interface OrderProduct {
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  discountPercent: number;
  finalPrice: number;
  total: number;
}

interface OrderRecord {
  id: string;
  userIdi: number;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  deliveryTime: string;
  deliveryDate: string;
  discountCode: string;
  deliveryMethod: {
    name: string;
    cost: number;
  };
  products: OrderProduct[];
  totalPrice: number;
  finalShippingCost: number;
  validDiscount: number;
  finalAmount: number;
  createdAt: string;
  isDelivered: boolean;
}

function Order() {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<OrderRecord | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formatShamsiDate = (date: moment.MomentInput) => {
    return moment(date).format("jYYYY/jMM/jDD");
  };

  const user =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "{}")
      : {};
  const userIdi = user?.userIdi;

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${BASE_url}/api/records/orders`, {
        headers: { api_key: API_KEY },
      });

      const userOrders = res.data.records.filter(
        (o: OrderRecord) => o.userIdi === userIdi
      );

      setOrders(userOrders);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (order: OrderRecord) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedOrder(null);
    setIsModalOpen(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-10 text-lg font-semibold border-t border-primary mx-4 px-6">
        {faLocalization.loading}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex justify-center py-20 text-xl font-bold border-t border-primary mx-4 px-6">
        سفارشی ثبت نشده است.
      </div>
    );
  }

  return (
    <div className="border-t border-primary m-4 p-6">
      <h1 className="font-semibold text-lg mb-4">سفارش‌های من</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-right border border-gray-300">
          <thead className="bg-light text-xs font-bold text-center">
            <tr>
              <th className="p-2 border">شناسه سفارش</th>
              <th className="p-2 border">تاریخ سفارش</th>
              <th className="p-2 border">تاریخ تحویل</th>
              <th className="p-2 border">آدرس</th>
              <th className="p-2 border">کد تخفیف</th>
              <th className="p-2 border">روش ارسال</th>
              <th className="p-2 border">مبلغ کل سفارش</th>
              <th className="p-2 border">محصولات سفارش</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-t text-center">
                <td className="p-2 border">{order.id}</td>
                <td className="p-2 border">
                  {formatShamsiDate(order.createdAt)}
                </td>
                <td className="p-2 border">
                  {!order.isDelivered
                    ? "در حال ارسال..."
                    : formatShamsiDate(order.deliveryDate)}
                </td>
                <td className="p-2 border">{order.address}</td>
                <td className="p-2 border">
                  {order.validDiscount.toLocaleString()} {faLocalization.rial}
                </td>
                <td className="p-2 border max-w-28">
                  {order.deliveryMethod.name}{" "}
                  {order.finalShippingCost === 0
                    ? "ارسال رایگان"
                    : order.finalShippingCost.toLocaleString() +
                      " " +
                      faLocalization.rial}
                </td>
                <td className="p-2 border">
                  {order.finalAmount.toLocaleString()} {faLocalization.rial}
                </td>

                {/* نمایش جدول محصولات در دسکتاپ */}
                <td className="p-2 border hidden lg:table-cell">
                  <table className="w-full text-xs border-collapse">
                    <thead>
                      <tr className="bg-light/50">
                        <th className="p-1 border">نام محصول</th>
                        <th className="p-1 border">قیمت واحد</th>
                        <th className="p-1 border">تعداد</th>
                        <th className="p-1 border">درصد تخفیف</th>
                        <th className="p-1 border">قیمت محصول</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.products.map((product) => (
                        <tr key={product.productId}>
                          <td className="p-1 border">{product.name}</td>
                          <td className="p-1 border">
                            {product.unitPrice.toLocaleString()}{" "}
                            {faLocalization.rial}
                          </td>
                          <td className="p-1 border text-center">
                            {product.quantity}
                          </td>
                          <td className="p-1 border text-center">
                            %{product.discountPercent}
                          </td>
                          <td className="p-1 border">
                            {product.total.toLocaleString()}{" "}
                            {faLocalization.rial}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </td>

                {/* دکمه در حالت موبایل */}
                <td className="p-2 border lg:hidden text-center">
                  <button
                    onClick={() => openModal(order)}
                    className="text-primary underline hover:text-secondary"
                  >
                    مشاهده محصولات
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* مودال نمایش محصولات */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 px-4">
          <div className="bg-white max-w-md w-full p-4 rounded-lg shadow-md relative">
            <button
              onClick={closeModal}
              className="absolute top-2 left-2 text-gray-500 hover:text-black text-sm"
            >
              ✕
            </button>
            <h2 className="text-center font-bold text-lg mb-2">
              محصولات سفارش
            </h2>
            <table className="w-full text-xs border border-gray-300">
              <thead className="bg-light">
                <tr>
                  <th className="p-1 border">نام محصول</th>
                  <th className="p-1 border">قیمت واحد</th>
                  <th className="p-1 border">تعداد</th>
                  <th className="p-1 border">درصد تخفیف</th>
                  <th className="p-1 border">قیمت کل محصول</th>
                </tr>
              </thead>
              <tbody>
                {selectedOrder.products.map((product) => (
                  <tr key={product.productId}>
                    <td className="p-1 border">{product.name}</td>
                    <td className="p-1 border">
                      {product.unitPrice.toLocaleString()} {faLocalization.rial}
                    </td>
                    <td className="p-1 border">{product.quantity}</td>
                    <td className="p-1 border">%{product.discountPercent}</td>
                    <td className="p-1 border">
                      {product.total.toLocaleString()} {faLocalization.rial}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default Order;
