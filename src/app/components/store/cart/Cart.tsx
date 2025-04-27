"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/app/redux/store/hooks";
import {
  getCartItems,
  removeFromCart,
  updateCartItem,
} from "@/app/redux/reducers/cartReducer/cartReducer";
import { toast } from "react-toastify";

export default function CartPage() {
  const dispatch = useAppDispatch();
  const { items, status } = useAppSelector((state) => state.cart);

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
      toast.error("موجودی کافی نیست");
      return;
    }
    try {
      await dispatch(
        updateCartItem({ cartItemId, quantity: currentQuantity + 1 })
      ).unwrap();
    } catch {
      toast.error("خطا در افزایش تعداد محصول");
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
      toast.error("خطا در کاهش تعداد محصول");
    }
  };

  const handleRemove = async (cartItemId: string) => {
    try {
      await dispatch(removeFromCart(cartItemId)).unwrap();
    } catch {
      toast.error("خطا در حذف محصول");
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
      <div className="flex justify-center py-10 text-xl font-semibold">
        در حال بارگذاری...
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-6">
        <h2 className="text-2xl font-bold">سبد خرید شما خالی است</h2>
        <p className="text-gray-500">محصولی به سبد خرید اضافه نکرده‌اید.</p>
      </div>
    );
  }

  return (
    <div className="border-t border-primary mx-4 p-4 ">
      <h1 className="text-3xl font-bold mb-8">سبد خرید</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* سبد خرید (آیتم ها) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 p-4 bg-white rounded-xl shadow"
            >
              <img
                src={item.image}
                alt={item.productName}
                className="w-24 h-24 rounded-lg object-cover"
              />
              <div className="flex-1">
                <h2 className="text-lg font-bold">{item.productName}</h2>
                <p className="text-gray-500 text-sm">
                  تاریخ انقضا: {item.productExpired}
                </p>
                <p className="text-gray-500 text-sm">
                  قیمت واحد: {item.productPrice.toLocaleString()} ریال
                </p>
                {item.discountPercent > 0 && (
                  <div className="text-green-500 font-bold mt-2">
                    {item.discountPercent}% تخفیف
                  </div>
                )}
                <div className="flex items-center gap-3 mt-2">
                  <button
                    onClick={() => handleDecrease(item.id, item.quantity)}
                    className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center text-xl"
                  >
                    -
                  </button>
                  <span className="text-lg font-bold">{item.quantity}</span>
                  <button
                    onClick={() =>
                      handleIncrease(
                        item.id,
                        item.quantity,
                        item.productQuantity
                      )
                    }
                    disabled={item.quantity >= item.productQuantity}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-2xl transition 
                    ${
                      item.quantity >= item.productQuantity
                        ? "bg-gray-400 text-white cursor-not-allowed"
                        : "bg-green-500 text-white hover:bg-green-600"
                    }`}
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="text-center">
                {item.discountPercent > 0 && (
                  <p className="text-sm line-through text-gray-400">
                    {(item.productPrice * item.quantity).toLocaleString()} ریال
                  </p>
                )}
                <p className="text-lg font-bold">
                  {(
                    item.productPrice *
                    (1 - item.discountPercent / 100) *
                    item.quantity
                  ).toLocaleString()}{" "}
                  ریال
                </p>
                <button
                  onClick={() => handleRemove(item.id)}
                  className="text-red-500 mt-2 text-sm underline"
                >
                  حذف
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* خلاصه پرداخت */}
        <div className="relative">
          <div className="sticky top-28 p-6 bg-white rounded-xl shadow flex flex-col gap-6">
            <h2 className="text-xl font-bold">خلاصه سبد خرید</h2>

            <div className="flex justify-between text-base">
              <span>قیمت کل:</span>
              <span>{calculateOriginPrice().toLocaleString()} ریال</span>
            </div>

            <div className="flex justify-between text-base text-green-600">
              <span>سود شما:</span>
              <span>
                {(
                  calculateOriginPrice() - calculateTotalPrice()
                ).toLocaleString()}{" "}
                ریال
              </span>
            </div>

            <div className="flex justify-between text-lg font-bold">
              <span>مبلغ قابل پرداخت:</span>
              <span>{calculateTotalPrice().toLocaleString()} ریال</span>
            </div>

            <button className="w-full py-3 bg-primary hover:bg-primary/90 text-white rounded-xl text-lg font-semibold transition">
              ادامه فرآیند خرید
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
