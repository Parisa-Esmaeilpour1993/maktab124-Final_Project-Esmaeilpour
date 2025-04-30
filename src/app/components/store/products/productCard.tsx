import Link from "next/link";
import FavoriteButton from "./FavoriteButton";
import { BASE_url } from "@/app/constants/api/BASE_URL";
import {
  faLocalization,
  productsLocalization,
} from "@/app/constants/localization/fa/localization";
import moment from "jalali-moment";
import AddToCartButton from "../singleProduct/AddToCartButton";

export default function ProductCard({
  product,
  discount,
}: {
  product: any;
  discount: { productName: string; discountPercent: number } | undefined;
}) {
  const formatShamsiDate = (date: moment.MomentInput) => {
    return moment(date).format("jYYYY/jMM/jDD");
  };

  const quantity = +product.productQuantity;
  const isOutOfStock = quantity === 0;
  const hasDiscount = !!discount;
  const originalPrice = +product.productPrice;
  const finalPrice = hasDiscount
    ? Math.floor(originalPrice * (1 - discount.discountPercent / 100))
    : originalPrice;

  return (
    <div
      className={`border border-secondary rounded-lg flex flex-col gap-2 justify-between py-4 px-6 shadow relative text-center transition-opacity ${
        isOutOfStock ? "opacity-50 grayscale pointer-events-none" : ""
      }`}
    >
      <Link href={`/singleProduct/${product.id}`}>
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
          <FavoriteButton productId={product.id} />
        </div>

        <h4 className="flex items-center justify-center text-sm font-semibold mb-2 h-8">
          {product.productName}
        </h4>

        <p className="text-primary text-sm font-semibold flex flex-col xl:flex-row gap-1 xl:gap-2 items-center justify-center h-8">
          {hasDiscount && (
            <span className="line-through text-gray-400 mr-2">
              {originalPrice.toLocaleString()} {faLocalization.rial}
            </span>
          )}
          {finalPrice.toLocaleString()} {faLocalization.rial}
        </p>

        <div className="flex flex-col items-center justify-center text-sm text-gray-700 my-2 h-10">
          <div className="flex gap-[2px] items-center justify-center mt-2">
            <p>{productsLocalization.expireDate}:</p>
            <p>{formatShamsiDate(product.productExpired)}</p>
          </div>
          {quantity < 5 && (
            <p
              className={`${
                isOutOfStock ? "text-gray-500" : "text-red-600 mb-2"
              }`}
            >
              {isOutOfStock
                ? productsLocalization.unavailable
                : `${faLocalization.just} ${quantity} ${faLocalization.isAvailable}`}
            </p>
          )}
        </div>
      </Link>
      <AddToCartButton productId={product.id} />
    </div>
  );
}
