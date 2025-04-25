"use client";

import { useState } from "react";
import { BiCartAdd } from "react-icons/bi";
import { RiDeleteBin6Line } from "react-icons/ri";
import Link from "next/link";
import Button from "@/app/shared/Button";
import FavoriteButton from "./FavoriteButton";
import { BASE_url } from "@/app/constants/api/BASE_URL";
import {
  faLocalization,
  productsLocalization,
} from "@/app/constants/localization/fa/localization";

export default function ProductCard({
  product,
  discount,
  isFavorite,
  favoriteRecords,
}: {
  product: any;
  discount: { productName: string; discountPercent: number } | undefined;
  isFavorite: boolean;
  favoriteRecords: any[];
}) {
  const [cartCount, setCartCount] = useState(0);

  const quantity = +product.productQuantity;
  const isOutOfStock = quantity === 0;
  const hasDiscount = !!discount;
  const originalPrice = +product.productPrice;
  const finalPrice = hasDiscount
    ? Math.floor(originalPrice * (1 - discount.discountPercent / 100))
    : originalPrice;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    setCartCount(1);
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.preventDefault();
    if (cartCount < quantity) {
      setCartCount(cartCount + 1);
    }
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.preventDefault();
    if (cartCount > 1) {
      setCartCount(cartCount - 1);
    } else {
      setCartCount(0);
    }
  };

  return (
    <Link
      href={`/singleProduct/${product.id}`}
      className={`border border-secondary rounded-lg flex flex-col gap-2 justify-between py-4 px-6 shadow relative text-center transition-opacity ${
        isOutOfStock ? "opacity-50 grayscale pointer-events-none" : ""
      }`}
    >
      {hasDiscount && (
        <div className="absolute top-2 left-2 bg-amber-600 text-white text-xs px-2 py-1 rounded animate-pulseGlow">
          %{discount.discountPercent} {productsLocalization.discount}
        </div>
      )}

      <div className="relative flex items-center justify-center border-b mb-2 p-2">
        <img
          src={`${BASE_url}${product.image}`}
          alt={product.productName}
          className="h-40 p-5"
        />
        <FavoriteButton
          productId={product.id}
          isFavorite={isFavorite}
          favoriteRecords={favoriteRecords}
        />
      </div>

      <h4 className="text-sm font-semibold">{product.productName}</h4>

      <p className="text-primary text-sm font-semibold flex flex-col xl:flex-row gap-2 items-center justify-center">
        {hasDiscount && (
          <span className="line-through text-gray-400 mr-2">
            {originalPrice.toLocaleString()} {faLocalization.rial}
          </span>
        )}
        {finalPrice.toLocaleString()} {faLocalization.rial}
      </p>

      <div className="text-sm text-gray-700">
        <div className="flex gap-2 items-center">
          <p>{productsLocalization.expireDate}:</p>
          <p>{product.productExpired}</p>
        </div>
        {quantity < 5 && (
          <p
            className={`mt-2 ${
              isOutOfStock ? "text-gray-500" : "text-red-600 text-right mb-2"
            }`}
          >
            {isOutOfStock
              ? productsLocalization.unavailable
              : `${faLocalization.just} ${quantity} ${faLocalization.isAvailable}`}
          </p>
        )}
      </div>

      <div className="items-center justify-between">
        {cartCount > 0 ? (
          <div className="flex items-center gap-2 justify-center">
            <button
              onClick={handleIncrement}
              className="w-7 h-7 rounded-full bg-red-600 text-white flex items-center justify-center hover:bg-red-700 transition duration-200 active:scale-90"
            >
              <BiCartAdd />
            </button>
            <span className="w-7 text-center font-bold">{cartCount}</span>
            <button
              onClick={handleDecrement}
              className="w-7 h-7 rounded-full bg-amber-500 text-white flex items-center justify-center hover:bg-amber-600 transition duration-200 active:scale-90"
            >
              <RiDeleteBin6Line />
            </button>
          </div>
        ) : (
          <button
            children={productsLocalization.addToCart}
            onClick={handleAddToCart}
            className="px-2 py-1 text-sm bg-secondary hover:bg-primary cursor-pointer text-white rounded-md"
          />
        )}
      </div>
    </Link>
  );
}
