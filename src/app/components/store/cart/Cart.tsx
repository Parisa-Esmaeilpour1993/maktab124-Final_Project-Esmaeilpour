"use client";

import { BASE_url } from "@/app/constants/api/BASE_URL";
import {
  cartLocalization,
  faLocalization,
  productsLocalization,
} from "@/app/constants/localization/fa/localization";
import {
  getCartItems,
  removeFromCart,
  updateCartItem,
} from "@/app/redux/reducers/cartReducer/cartReducer";
import { useAppDispatch, useAppSelector } from "@/app/redux/store/hooks";
import Button from "@/app/shared/Button";
import { confirmDelete } from "@/app/utils/sweetAlert";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ImBin } from "react-icons/im";
import { toast, ToastContainer } from "react-toastify";

export default function CartPage() {
  const dispatch = useAppDispatch();
  const { items, status } = useAppSelector((state) => state.cart);
  const router = useRouter();

  useEffect(() => {
    dispatch(getCartItems());
  }, []);

  useEffect(() => {
    if (items.length === 0) {
      dispatch(getCartItems());
    }
  }, [dispatch, items.length]);

  const handleIncrease = async (
    cartItemId: string,
    currentQuantity: number,
    maxQuantity: number
  ) => {
    if (currentQuantity >= maxQuantity) {
      toast.error(cartLocalization.notEnough);
      return;
    }
    try {
      await dispatch(
        updateCartItem({ cartItemId, quantity: currentQuantity + 1 })
      ).unwrap();
    } catch {
      toast.error(cartLocalization.errorInIncrease);
    }
  };

  const handleDecrease = async (
    cartItemId: string,
    currentQuantity: number
  ) => {
    try {
      if (currentQuantity <= 1) {
        await dispatch(removeFromCart(cartItemId)).unwrap();
      } else {
        await dispatch(
          updateCartItem({ cartItemId, quantity: currentQuantity - 1 })
        ).unwrap();
      }
    } catch {
      toast.error(cartLocalization.errorInDecrease);
    }
  };

  const handleRemove = async (cartItemId: string) => {
    const result = await confirmDelete();
    if (result.isConfirmed) {
      try {
        await dispatch(removeFromCart(cartItemId)).unwrap();
      } catch {
        toast.error(cartLocalization.errorInDelete);
      }
    }
  };

  const calculateTotalPrice = () => {
    return items.reduce((total, item) => {
      const discountedPrice =
        item.productPrice * (1 - item.discountPercent / 100);
      return total + discountedPrice * item.quantity;
    }, 0);
  };

  const calculateOriginPrice = () => {
    return items.reduce((total, item) => {
      return total + item.productPrice * item.quantity;
    }, 0);
  };

  if (status === "loading") {
    return (
      <div className="flex justify-center py-10 text-xl font-semibold border-t mx-4 border-primary p-6">
        {faLocalization.loading}
      </div>
    );
  }

  const handleContinue = () => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

    if (!token) {
      toast.error(cartLocalization.loginError);
      router.push("/login");
      return;
    }

    router.push("/checkOut");
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-6 border-t mx-4 border-primary p-6">
        <h2 className="text-2xl font-bold">{cartLocalization.emptyCart}</h2>
        <p className="text-gray-500">{cartLocalization.notAddedYet}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="border-t mx-4 border-primary p-6">
        <h1 className="text-xl font-bold mb-6">{cartLocalization.cart}</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* لیست آیتم‌های سبد خرید */}
          <div className="flex-1 space-y-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex flex-col md:flex-row items-center justify-between p-4 bg-light/40 rounded-xl shadow-accent"
              >
                <Link
                  href={`/singleProduct/${item.productId}`}
                  className="flex flex-col sm:flex-row items-center gap-4"
                >
                  <img
                    src={`${BASE_url}${item.image}`}
                    alt={item.productName}
                    className="w-20 h-20 rounded-lg object-cover"
                  />

                  <div className="flex-1 flex flex-col gap-2 text-center md:text-right">
                    <h2 className=" font-semibold">{item.productName}</h2>
                    <p className="text-gray-500 text-sm">
                      {productsLocalization.expireDate} : :{" "}
                      <span dir="ltr">{item.productExpired}</span>
                    </p>
                    <p className="text-gray-500 text-sm">
                      {cartLocalization.pricePerProduct}:{" "}
                      {item.productPrice.toLocaleString()} {faLocalization.rial}
                    </p>
                    {item.discountPercent > 0 && (
                      <div className="text-accent flex gap-2 items-center font-semibold mt-2">
                        %{item.discountPercent}{" "}
                        <div className="">{productsLocalization.discount}</div>
                      </div>
                    )}
                  </div>
                </Link>

                <div>
                  {item.discountPercent ? (
                    <p className="text-lg font-semibold line-through text-gray-400 text-left">
                      {(item.productPrice * item.quantity).toLocaleString()}{" "}
                      {faLocalization.rial}
                    </p>
                  ) : (
                    ""
                  )}
                  <p className="text-lg font-bold text-primary text-left">
                    {(
                      item.productPrice *
                      (1 - item.discountPercent / 100) *
                      item.quantity
                    ).toLocaleString()}{" "}
                    {faLocalization.rial}
                  </p>
                  <div className="flex flex-col items-center md:items-end gap-2">
                    <div className="flex items-center justify-center md:justify-end gap-3 mt-3">
                      <button
                        onClick={() => handleDecrease(item.id, item.quantity)}
                        className="w-6 h-6 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center active:scale-95"
                      >
                        -
                      </button>
                      <span className="text-lg font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          handleIncrease(
                            item.id,
                            item.quantity,
                            item.productQuantity
                          )
                        }
                        disabled={item.quantity >= item.productQuantity}
                        className={`w-6 h-6 rounded-full flex items-center justify-center transition ${
                          item.quantity >= item.productQuantity
                            ? "bg-gray-400 text-white cursor-not-allowed pt-[2px] "
                            : "bg-secondary text-white hover:bg-primary pt-[2px] active:scale-95"
                        }`}
                      >
                        +
                      </button>
                    </div>
                    <div className="flex justify-center md:justify-end">
                      <button
                        onClick={() => handleRemove(item.id)}
                        className="text-red-500 hover:text-red-600 mt-2 text-sm underline"
                        title={faLocalization.delete}
                      >
                        <ImBin size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* خلاصه سفارش */}
          <div className="w-full lg:w-1/3">
            <div className="sticky top-24 p-8 text-gray-700 rounded-xl border border-accent shadow-accent flex flex-col gap-6">
              <h2 className="text-lg font-semibold">
                {cartLocalization.orderDetail}
              </h2>

              <div className="flex justify-between font-semibold">
                <span>{cartLocalization.totalPrice} :</span>
                <span>{calculateOriginPrice().toLocaleString()} ریال</span>
              </div>

              <div className="flex justify-between text-secondary font-semibold">
                <span>{cartLocalization.benefit}</span>
                <span>
                  {(
                    calculateOriginPrice() - calculateTotalPrice()
                  ).toLocaleString()}{" "}
                  ریال
                </span>
              </div>

              <div className="flex justify-between font-semibold border-t pt-4">
                <span>{cartLocalization.payableAmount}</span>
                <span>{calculateTotalPrice().toLocaleString()} ریال</span>
              </div>

              <Button
                children={cartLocalization.continue}
                className="!bg-primary hover:!bg-secondary"
                onClick={handleContinue}
              />
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
