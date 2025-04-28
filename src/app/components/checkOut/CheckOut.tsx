"use client";

import { API_KEY, BASE_url } from "@/app/constants/api/BASE_URL";
import {
  adminLocalization,
  cartLocalization,
  checkOutLocalization,
  faLocalization,
} from "@/app/constants/localization/fa/localization";
import { useAppSelector } from "@/app/redux/store/hooks";
import Button from "@/app/shared/Button";
import { Input } from "@/app/shared/Input";
import { Textarea } from "@/app/shared/TextArea";
import { DeliveryMethod } from "@/app/types/deliveryMethods";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function CheckOut() {
  const { items } = useAppSelector((state) => state.cart);
  const router = useRouter();

  const [userInfo, setUserInfo] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
  });

  const [offTickets, setOffTickets] = useState([]);
  const [deliveryMethods, setDeliveryMethods] = useState([]);
  const [discountCode, setDiscountCode] = useState("");
  const [validDiscount, setValidDiscount] = useState<number>(0);
  const [selectedDelivery, setSelectedDelivery] =
    useState<DeliveryMethod | null>(null);

  useEffect(() => {
    fetchOffTickets();
    fetchDeliveryMethods();
  }, []);

  const fetchOffTickets = async () => {
    try {
      const { data } = await axios.get(`${BASE_url}/api/records/offTickets`, {
        headers: {
          api_key: API_KEY,
        },
      });
      setOffTickets(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchDeliveryMethods = async () => {
    try {
      const { data } = await axios.get(
        `${BASE_url}/api/records/deliveryMethods`,
        {
          headers: {
            api_key: API_KEY,
          },
        }
      );
      setDeliveryMethods(data.records);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDiscountCheck = () => {
    const ticket = offTickets.find(
      (ticket: any) => ticket.title === discountCode.trim()
    );
    if (ticket) {
      setValidDiscount(ticket.discountAmount || 0);
      toast.success(checkOutLocalization.applyDiscount);
    } else {
      setValidDiscount(0);
      toast.error(checkOutLocalization.invalidDiscount);
    }
  };

  const calculateTotalPrice = () => {
    const total = items.reduce((acc, item) => {
      const discountedPrice =
        item.productPrice * (1 - item.discountPercent / 100);
      return acc + discountedPrice * item.quantity;
    }, 0);
    return total - validDiscount;
  };

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

  const handleSubmit = () => {
    if (!userInfo) {
      toast.error(checkOutLocalization.allRequired);
      return;
    }
    if (!selectedDelivery) {
      toast.error(checkOutLocalization.chooseDelivery);
      return;
    }
    router.push("/payment");
  };

  return (
    <div className="border-t border-primary mx-4 p-6 space-y-10">
      {/* اطلاعات کاربر */}
      <div className="p-6 border rounded-xl shadow-accent space-y-4">
        <h2 className="text-lg font-semibold mb-4">
          {checkOutLocalization.userInformation}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Input
            type="text"
            placeholder={adminLocalization.firstName}
            value={userInfo.firstName}
            onChange={(e) =>
              setUserInfo({ ...userInfo, firstName: e.target.value })
            }
            title={adminLocalization.firstName}
          />
          <Input
            type="text"
            placeholder={adminLocalization.lastName}
            value={userInfo.lastName}
            onChange={(e) =>
              setUserInfo({ ...userInfo, lastName: e.target.value })
            }
            title={adminLocalization.lastName}
          />
          <Input
            type="text"
            placeholder={adminLocalization.phone}
            value={userInfo.phone}
            onChange={(e) =>
              setUserInfo({ ...userInfo, phone: e.target.value })
            }
            title={adminLocalization.phone}
          />
        </div>
        <Textarea
          placeholder={adminLocalization.address}
          value={userInfo.address}
          onChange={(e) =>
            setUserInfo({ ...userInfo, address: e.target.value })
          }
          title={adminLocalization.address}
        />
      </div>

      {/* خلاصه سبد خرید */}
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

      {/* کد تخفیف */}
      <div className="p-6 border rounded-xl shadow-accent space-y-4">
        <h2 className="text-lg font-semibold mb-4">
          {checkOutLocalization.discountCode}
        </h2>
        <div className="flex gap-4">
          <Input
            type="text"
            placeholder={checkOutLocalization.discountCode}
            value={discountCode}
            onChange={(e) => setDiscountCode(e.target.value)}
          />
          <Button
            children={checkOutLocalization.apply}
            onClick={handleDiscountCheck}
          />
        </div>
      </div>

      {/* روش ارسال */}
      <div className="p-6 border rounded-xl shadow-accent space-y-4">
        <h2 className="text-lg font-semibold mb-4">
          {checkOutLocalization.deliveryMethod}
        </h2>
        <div className="space-y-4">
          {deliveryMethods.map((method: any) => (
            <div key={method.id} className="flex items-center gap-2">
              <input
                type="radio"
                name="delivery"
                value={method.id}
                onChange={() => setSelectedDelivery(method)}
                className="accent-primary"
              />
              <span>
                {method.name} - {method.minCost?.toLocaleString()} ریال
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* قیمت نهایی */}
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

      {/* دکمه تایید */}
      <div className="text-center">
        <Button
          children={checkOutLocalization.continue}
          onClick={handleSubmit}
          className="!bg-primary hover:!bg-secondary w-1/2"
        />
      </div>
    </div>
  );
}
