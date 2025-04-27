"use client";

import {
  addToCart,
  getCartItems,
  removeFromCart,
  updateCartItem,
} from "@/app/redux/reducers/cartReducer/cartReducer";
import { useAppDispatch, useAppSelector } from "@/app/redux/store/hooks";
import { useEffect, useState } from "react";
import { FaCartPlus } from "react-icons/fa6";
import { toast } from "react-toastify";

type AddToCartButtonProps = {
  productId: string;
};

export default function AddToCartButton({ productId }: AddToCartButtonProps) {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);
  const [loading, setLoading] = useState(false);

  const existingItem = cartItems.find((item) => item.productId === productId);
  const quantity = existingItem?.quantity || 0;
  const maxQuantity = existingItem?.productQuantity || 0;

  useEffect(() => {
    dispatch(getCartItems());
  }, [dispatch]);

  const handleAddToCart = async () => {
    setLoading(true);
    try {
      await dispatch(addToCart({ productId, quantity: 1 })).unwrap();
      toast.success("محصول به سبد خرید اضافه شد");
    } catch (error) {
      console.error(error);
      toast.error("خطا در افزودن محصول به سبد خرید");
    } finally {
      setLoading(false);
    }
  };

  const handleIncrease = async () => {
    if (!existingItem) return;
    if (existingItem.quantity >= existingItem.productQuantity) {
      toast.error("موجودی کافی نیست");
      return;
    }
    try {
      await dispatch(
        updateCartItem({ cartItemId: existingItem.id, quantity: quantity + 1 })
      ).unwrap();
    } catch (error) {
      console.error(error);
      toast.error("خطا در افزایش تعداد");
    }
  };

  const handleDecrease = async () => {
    if (!existingItem) return;
    try {
      if (quantity <= 1) {
        await dispatch(removeFromCart(existingItem.id)).unwrap();
      } else {
        await dispatch(
          updateCartItem({
            cartItemId: existingItem.id,
            quantity: quantity - 1,
          })
        ).unwrap();
      }
    } catch (error) {
      console.error(error);
      toast.error("خطا در کاهش تعداد");
    }
  };

  if (quantity > 0) {
    return (
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={handleDecrease}
          className="w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center text-2xl"
        >
          -
        </button>
        <span className="text-lg font-bold">{quantity}</span>
        <button
          onClick={handleIncrease}
          disabled={quantity >= maxQuantity}
          className={`w-10 h-10 rounded-full flex items-center justify-center text-2xl transition 
          ${
            quantity >= maxQuantity
              ? "bg-gray-400 text-white cursor-not-allowed"
              : "bg-green-500 text-white hover:bg-green-600"
          }`}
        >
          +
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleAddToCart}
      disabled={loading}
      className="w-full py-3 bg-primary rounded-xl font-semibold text-white hover:bg-primary/90 transition disabled:opacity-50"
    >
      {loading ? (
        "در حال افزودن..."
      ) : (
        <div className="flex items-center justify-center gap-2">
          <FaCartPlus size={20} />
          <span>افزودن به سبد خرید</span>
        </div>
      )}
    </button>
  );
}
