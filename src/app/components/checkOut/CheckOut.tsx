"use client";

import { API_KEY, BASE_url } from "@/app/constants/api/BASE_URL";
import { checkOutLocalization } from "@/app/constants/localization/fa/localization";
import { useAppSelector } from "@/app/redux/store/hooks";
import Button from "@/app/shared/Button";
import { DeliveryMethod } from "@/app/types/deliveryMethods";
import { UserInfoData } from "@/app/types/UserInfo";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import Bill from "./Bill";
import CartSummary from "./CartSummary";
import DeliveryMethods from "./DeliveryMethods";
import DeliveryTime from "./DeliveryTime";
import DiscountCode from "./DiscountCode";
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
  const [validDiscount, setValidDiscount] = useState<number>(0);
  const [selectedDelivery, setSelectedDelivery] =
    useState<DeliveryMethod | null>(null);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [deliveryTime, setDeliveryTime] = useState<Date | null>(null);
  const [discountCode, setDiscountCode] = useState("");

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

        const users = res?.data.records;
        const user = users.find(
          (user: UserInfoData) => user.userIdi === userIdi
        );

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

  const calculateTotalPrice = () => {
    const total = items.reduce((acc, item) => {
      const discountedPrice =
        item.productPrice * (1 - item.discountPercent / 100);
      return acc + discountedPrice * item.quantity;
    }, 0);
    return total;
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

  const handleSubmit = async () => {
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

    if (!deliveryTime) {
      toast.error(checkOutLocalization.selectTime);
      return;
    }

    const orderPayload = {
      userIdi,
      firstName: userInfo.firstName,
      lastName: userInfo.lastName,
      phone: userInfo.phone,
      address: selectedAddress,
      deliveryTime: deliveryTime?.toISOString(),
      discountCode: validDiscount > 0 ? discountCode : "",
      deliveryMethod: {
        name: selectedDelivery.name,
        cost: selectedDelivery.minCost,
      },
      products: items.map((item) => ({
        productId: item.id,
        name: item.productName,
        quantity: item.quantity,
        unitPrice: item.productPrice,
        discountPercent: item.discountPercent,
        finalPrice: item.productPrice * (1 - item.discountPercent / 100),
        total:
          item.quantity * item.productPrice * (1 - item.discountPercent / 100),
      })),
      totalPrice: calculateTotalPrice(),
      finalShippingCost: finalShippingCost,
      validDiscount: validDiscount,
      finalAmount: payableAmount,
      createdAt: new Date().toISOString(),
    };

    console.log(orderPayload);
    try {
      await axios.post(`${BASE_url}/api/records/orders`, orderPayload, {
        headers: {
          api_key: API_KEY,
        },
      });

      toast.success("سفارش ثبت شد");
      router.push("/payment");
    } catch (error) {
      console.error("خطا در ثبت سفارش:", error);
      toast.error("خطا در ثبت سفارش");
    }
  };

  const payableAmount =
    calculateTotalPrice() + finalShippingCost - validDiscount;

  return (
    <div>
      <div className="border-t border-primary mx-4 p-6 space-y-10">
        {/* اطلاعات کاربر */}
        <UserInfo
          userInfo={userInfo}
          setUserInfo={setUserInfo}
          setSelectedAddress={setSelectedAddress}
        />

        {/* خلاصه سبد خرید */}
        <CartSummary items={items} />

        {/* کد تخفیف */}
        <DiscountCode
          offTickets={offTickets}
          calculateTotalPrice={calculateTotalPrice}
          setValidDiscount={setValidDiscount}
          discountCode={discountCode}
          setDiscountCode={setDiscountCode}
        />

        {/* زمان ارسال  */}
        <DeliveryTime
          setDeliveryTime={setDeliveryTime}
          deliveryTime={deliveryTime}
        />

        {/* روش ارسال */}
        <DeliveryMethods
          deliveryMethods={deliveryMethods}
          setSelectedDelivery={setSelectedDelivery}
        />

        {/* قیمت نهایی */}
        <Bill
          validDiscount={validDiscount}
          calculateTotalPrice={calculateTotalPrice}
          selectedDelivery={selectedDelivery}
          payableAmount={payableAmount}
          isFreeShipping={isFreeShipping}
        />

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
