"use client";

import {
  cartLocalization,
  faLocalization,
  sweetAlert,
} from "@/app/constants/localization/fa/localization";
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
      toast.success(cartLocalization.addedSuccessfully);
    } catch (error) {
      console.error(error);
      toast.error(sweetAlert.error);
    } finally {
      setLoading(false);
    }
  };

  const handleIncrease = async () => {
    if (!existingItem) return;
    if (existingItem.quantity >= existingItem.productQuantity) {
      toast.error(cartLocalization.notEnough);
      return;
    }
    try {
      await dispatch(
        updateCartItem({ cartItemId: existingItem.id, quantity: quantity + 1 })
      ).unwrap();
    } catch (error) {
      console.error(error);
      toast.error(sweetAlert.error);
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
      toast.error(sweetAlert.error);
    }
  };

  if (quantity > 0) {
    return (
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={handleDecrease}
          className="w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xl"
        >
          -
        </button>
        <span className="text-lg font-bold">{quantity}</span>
        <button
          onClick={handleIncrease}
          disabled={quantity >= maxQuantity}
          className={`w-8 h-8 rounded-full flex items-center justify-center text-xl transition 
          ${
            quantity >= maxQuantity
              ? "bg-gray-400 text-white cursor-not-allowed pt-1"
              : "bg-secondary text-white hover:bg-primary pt-1"
          }`}
        >
          +
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center">
      <button
        onClick={handleAddToCart}
        disabled={loading}
        className="w-full py-2 bg-primary rounded-xl font-semibold text-white hover:bg-primary/90 transition disabled:opacity-50"
      >
        {loading ? (
          faLocalization.adding
        ) : (
          <div className="flex items-center justify-center gap-2">
            <FaCartPlus size={18} className="hidden md:block" />
            <span className="text-xs lg:text-[13px] xl:text-[15px]">
              {cartLocalization.addToCart}
            </span>
          </div>
        )}
      </button>
    </div>
  );
}
