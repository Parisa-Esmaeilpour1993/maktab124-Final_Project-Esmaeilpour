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
        <DiscountCode
          setValidDiscount={setValidDiscount}
          offTickets={offTickets}
          calculateTotalPrice={calculateTotalPrice}
        />

        {/* زمان ارسال  */}
        <DeliveryTime />

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
