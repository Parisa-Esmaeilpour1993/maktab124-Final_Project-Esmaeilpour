"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { getAuthToken } from "../base/getAuthToken";
import Input, { PaymentFormData } from "../components/payment/Card";
import { API_KEY, BASE_url } from "../constants/api/BASE_URL";
import {
  checkOutLocalization,
  faLocalization,
  loginLocalization,
  productsLocalization,
} from "../constants/localization/fa/localization";
import { useAppDispatch } from "../redux/store/hooks";
import { clearCart } from "../redux/reducers/cartReducer/cartReducer";

const PaymentForm = () => {
  const router = useRouter();

  const [formData, setFormData] = useState<PaymentFormData>({
    cardName: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    secondPassword: "",
  });
  const [amount, setAmount] = useState<number | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [cartId, setCartId] = useState<string | null>(null);

  const [allowed, setAllowed] = useState(false);

  const dispatch = useAppDispatch();

  useEffect(() => {
    const orderId = localStorage.getItem("orderId");
    const amount = localStorage.getItem("payableAmount");

    if (!orderId || !amount) {
      router.replace("/cart");
    } else {
      setAllowed(true);
    }
  }, []);

  useEffect(() => {
    const storedAmount = localStorage.getItem("payableAmount");
    if (storedAmount) {
      setAmount(Number(storedAmount));
    }
    const storedOrderId = localStorage.getItem("orderId");
    if (storedOrderId) {
      setOrderId(storedOrderId);
    }
    const storedCartId = localStorage.getItem("cartId");
    if (storedCartId) {
      setCartId(storedCartId);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "cardNumber") {
      const numericValue = value.replace(/\D/g, "").slice(0, 24);

      const formattedValue = numericValue.match(/.{1,4}/g)?.join(" - ") || "";

      setFormData((prev) => ({
        ...prev,
        [name]: formattedValue,
      }));
    } else if (name === "expiryDate") {
      let formatted = value.replace(/\D/g, "");

      if (formatted.length >= 3) {
        formatted = `${formatted.slice(0, 2)}/${formatted.slice(2, 4)}`;
      }

      setFormData((prev) => ({
        ...prev,
        [name]: formatted,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const token = getAuthToken();

    const { cardName, cardNumber, expiryDate, cvv, secondPassword } = formData;

    if (!cardName || !cardNumber || !expiryDate || !cvv || !secondPassword) {
      toast.error(loginLocalization.allFieldsRequired);
      return;
    }

    const cleanedCardNumber = cardNumber.replace(/\D/g, "");
    const cleanedCVV = cvv.replace(/\D/g, "");

    if (cleanedCardNumber.length !== 16) {
      toast.error(checkOutLocalization.cartValidation);
      return;
    }

    if (cleanedCVV.length < 3) {
      toast.error(checkOutLocalization.cvvValidation);
      return;
    }

    try {
      await axios.delete(`${BASE_url}/api/records/cart/${cartId}`, {
        headers: {
          "Content-Type": "application/json",
          api_key: API_KEY,
          Authorization: `Bearer ${token}`,
        },
      });
      localStorage.removeItem("cartId");

      dispatch(clearCart());
      await axios.post(
        `${BASE_url}/api/records/payment`,
        {
          cardName,
          cardNumber: cleanedCardNumber,
          expiryDate,
          cvv: cleanedCVV,
          secondPassword,
          amount,
          orderId,
        },
        {
          headers: {
            "Content-Type": "application/json",
            api_key: API_KEY,
            Authorization: `Bearer ${token}`,
          },
        }
      );

      localStorage.removeItem("payableAmount");
      localStorage.removeItem("orderId");
      localStorage.removeItem("cartId");
      router.push("/payment-result?status=success");
    } catch (error) {
      axios.delete(`${BASE_url}/api/records/orders/${orderId}`, {
        headers: {
          "Content-Type": "application/json",
          api_key: API_KEY,
          Authorization: `Bearer ${token}`,
        },
      });
      localStorage.removeItem("payableAmount");
      localStorage.removeItem("orderId");
      console.error(error);
      router.push("/payment-result?status=fail");
    }
  };

  const handleCancel = async () => {
    const token = getAuthToken();

    await axios.delete(`${BASE_url}/api/records/orders/${orderId}`, {
      headers: {
        "Content-Type": "application/json",
        api_key: API_KEY,
        Authorization: `Bearer ${token}`,
      },
    });
    localStorage.removeItem("payableAmount");
    localStorage.removeItem("orderId");
    router.push("/payment-result?status=fail");
  };

  if (!allowed) return null;

  return (
    <div>
      <div className="w-full min-h-screen py-8 lg:py-0 bg-gray-50 flex flex-col-reverse lg:flex-row items-center justify-center gap-12 px-4 md:px-20">
        <form
          className="bg-white p-6 md:p-10 rounded-2xl shadow-2xl space-y-6 w-full lg:w-1/2 xl:w-3/5"
          onSubmit={handleSubmit}
        >
          <h2 className="text-2xl font-semibold text-gray-800 text-center">
            {checkOutLocalization.onlinePayment}
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                {checkOutLocalization.fullName}
              </label>
              <input
                type="text"
                placeholder={checkOutLocalization.nameHolder}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                name="cardName"
                value={formData.cardName}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                {checkOutLocalization.cartNumber}
              </label>
              <input
                type="text"
                placeholder="0000 0000 0000 0000"
                maxLength={25}
                dir="ltr"
                name="cardNumber"
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                value={formData.cardNumber}
                onChange={handleChange}
              />
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  {productsLocalization.expireDate}
                </label>
                <input
                  type="text"
                  placeholder={checkOutLocalization.dateHolder}
                  maxLength={5}
                  name="expiryDate"
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                  value={formData.expiryDate}
                  onChange={handleChange}
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  CVV2
                </label>
                <input
                  type="password"
                  placeholder="***"
                  maxLength={4}
                  name="cvv"
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                  value={formData.cvv}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                {checkOutLocalization.secondPass}
              </label>
              <input
                type="password"
                placeholder="******"
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                name="secondPassword"
                value={formData.secondPassword}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex items-center justify-between gap-4">
            <button
              type="submit"
              className="w-full bg-secondary hover:bg-primary text-white font-semibold py-3 rounded-lg transition-all duration-200"
            >
              {checkOutLocalization.payment}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-lg transition-all duration-200"
            >
              {checkOutLocalization.cancel}
            </button>
          </div>
        </form>
        <div className="bg-white shadow-2xl p-8 rounded-2xl w-full lg:w-1/2 xl:w-2/5">
          <Input formData={formData} />
          <div className="flex flex-col gap-4 mt-10 px-4 text-sm text-gray-700">
            <div className="flex flex-col gap-2">
              <div>{checkOutLocalization.p1}</div>
              <div>{checkOutLocalization.p2}</div>
              <div>{checkOutLocalization.p3}</div>
              <div className="pb-12 border-dashed border-b border-gray-900">
                {checkOutLocalization.webAddress} https://daroopharm.com
              </div>
            </div>
            <div>
              {checkOutLocalization.payablePrice}{" "}
              {amount
                ? `${amount.toLocaleString()} ${faLocalization.rial}`
                : faLocalization.loading}
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default PaymentForm;
