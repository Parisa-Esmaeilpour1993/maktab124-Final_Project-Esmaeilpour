"use client";

import { API_KEY, BASE_url } from "@/app/constants/api/BASE_URL";
import {
  checkOutLocalization,
  faLocalization,
} from "@/app/constants/localization/fa/localization";
import { useAppSelector } from "@/app/redux/store/hooks";
import Button from "@/app/shared/Button";
import { Input } from "@/app/shared/Input";
import { DeliveryMethod } from "@/app/types/deliveryMethods";
import { OffTicket } from "@/app/types/offTickets";
import { UserInfoData } from "@/app/types/UserInfo";
import axios from "axios";
import moment from "jalali-moment";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import CartSummary from "./CartSummary";
import UserInfo from "./UserInfo";

export default function CheckOut() {
  const { items } = useAppSelector((state) => state.cart);
  const router = useRouter();

  const [userInfo, setUserInfo] = useState<UserInfoData>({
    firstName: "",
    lastName: "",
    phone: "",
    addresses: [],
  });
  const [offTickets, setOffTickets] = useState([]);
  const [deliveryMethods, setDeliveryMethods] = useState([]);
  const [discountCode, setDiscountCode] = useState("");
  const [validDiscount, setValidDiscount] = useState<number>(0);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedDelivery, setSelectedDelivery] =
    useState<DeliveryMethod | null>(null);

  const [shamsiDate, setShamsiDate] = useState("");
  const [dayOfWeek, setDayOfWeek] = useState("");

  const user =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "{}")
      : {};
  const userIdi = user?.userIdi;

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!userIdi) return;
      try {
        const res = await axios.get(`${BASE_url}/api/records/users`, {
          headers: { api_key: API_KEY },
        });
        console.log(res.data.records);
        const users = res?.data.records;
        const user = users.find(
          (user: UserInfoData) => user.userIdi === userIdi
        );
        console.log(user);

        if (user) {
          setUserInfo({
            firstName: user.firstName || "",
            lastName: user.lastName || "",
            phone: user.phoneNumber || "",
            addresses: user.addresses || "",
          });
        }
      } catch (error) {
        console.error("خطا در دریافت اطلاعات کاربر:", error);
      }
    };

    fetchUserInfo();
  }, []);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value;
    setSelectedDate(date);

    if (date) {
      const m = moment(date, "YYYY-MM-DD").locale("fa");
      setShamsiDate(m.format("YYYY/MM/DD"));
      setDayOfWeek(m.format("dddd"));
    } else {
      setShamsiDate("");
      setDayOfWeek("");
    }
  };

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
      setOffTickets(data.records);
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
    const ticket = (offTickets as OffTicket[]).find(
      (ticket) => ticket.name === discountCode.trim()
    );
    if (!ticket) {
      setValidDiscount(0);
      toast.error(checkOutLocalization.invalidDiscount);
      return;
    }

    const totalPrice = calculateTotalPrice();

    if (totalPrice >= ticket.discountMinOrder) {
      setValidDiscount(ticket.discount || 0);
      toast.success(checkOutLocalization.applyDiscount);
    } else {
      setValidDiscount(0);
      toast.error(
        `${
          checkOutLocalization.minOrderAmount
        } ${ticket.discountMinOrder.toLocaleString()} ${faLocalization.rial}`
      );
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
    if (
      !userInfo.firstName ||
      !userInfo.lastName ||
      !userInfo.addresses ||
      !userInfo.phone
    ) {
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
    <div>
      <div className="border-t border-primary mx-4 p-6 space-y-10">
        {/* اطلاعات کاربر */}
        <UserInfo userInfo={userInfo} setUserInfo={setUserInfo} />

        {/* خلاصه سبد خرید */}
        <CartSummary items={items} />

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
            <Button
              children={checkOutLocalization.delete}
              className="!bg-gray-400 hover:!bg-gray-500"
              onClick={() => {
                setDiscountCode("");
                setValidDiscount(0);
                toast.info(checkOutLocalization.discountRemoved);
              }}
            />
          </div>
        </div>

        {/* زمان ارسال  */}
        <div className="p-6 border rounded-xl shadow-accent space-y-4">
          <h2 className="text-lg font-semibold mb-4">
            {checkOutLocalization.time}
          </h2>
          <div className="flex items-center gap-8">
            <div className="flex gap-4">
              <Input
                type="date"
                value={selectedDate}
                onChange={handleDateChange}
              />
            </div>
            {shamsiDate && (
              <div className="text-sm text-gray-600">
                {dayOfWeek} - {shamsiDate}
              </div>
            )}
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
      <ToastContainer />
    </div>
  );
}
