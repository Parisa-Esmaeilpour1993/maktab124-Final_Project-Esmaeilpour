import { BASE_url } from "@/app/constants/api/BASE_URL";
import {
  faLocalization,
  productsLocalization,
} from "@/app/constants/localization/fa/localization";
import Button from "@/app/shared/Button";
import { IProducts } from "@/app/types/products";
import { BiCartAdd } from "react-icons/bi";
import { RiDeleteBin6Line } from "react-icons/ri";
import FavoriteButton from "./FavoriteButton";
import Link from "next/link";

export default function ProductsList({
  products,
  discountedProducts,
  favoriteProductIds,
  favoriteRecords,
}: // isLoading,
IProducts) {
  // if (isLoading) {
  //   return (
  //     <div className="w-full flex justify-center items-center py-10 text-primary text-lg">
  //       <span className="animate-pulse">{faLocalization.loading}</span>
  //     </div>
  //   );
  // }

  // if (products.length === 0) {
  //   return (
  //     <div className="text-center text-gray-500 py-10 text-lg">
  //       {faLocalization.noProductFound}
  //     </div>
  //   );
  // }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {products.map((product) => {
        const quantity = +product.productQuantity;
        const isOutOfStock = quantity === 0;

        const discount = discountedProducts?.find(
          (item) => item.productName === product.productName
        );
        const hasDiscount = !!discount;
        const originalPrice = +product.productPrice;
        const finalPrice = hasDiscount
          ? Math.floor(originalPrice * (1 - discount.discountPercent / 100))
          : originalPrice;

        return (
          <Link
            key={product.id}
            className={`border border-secondary rounded-lg flex flex-col justify-between p-4 shadow relative text-center transition-opacity ${
              isOutOfStock ? "opacity-50 grayscale pointer-events-none" : ""
            }`}
            href={`/singleProduct/${product.id}`}
          >
            {hasDiscount && (
              <div className="absolute top-4 left-4 bg-amber-600 text-white text-xs px-2 py-1 rounded animate-pulseGlow">
                %{discount.discountPercent} {productsLocalization.discount}
              </div>
            )}

            <div className="relative flex items-center justify-center border-b mb-2">
              <img
                src={`${BASE_url}${product.image}`}
                alt={product.productName}
                className="h-40 p-4"
              />
              <FavoriteButton
                productId={product.id}
                isFavorite={favoriteProductIds.includes(product.id)}
                favoriteRecords={favoriteRecords}
              />
            </div>

            <h4 className=" font-bold">{product.productName}</h4>

            <p className="text-primary font-semibold flex gap-2 items-center justify-center">
              {hasDiscount && (
                <span className="line-through text-gray-400 mr-2">
                  {originalPrice.toLocaleString()} {faLocalization.rial}
                </span>
              )}
              {finalPrice.toLocaleString()} {faLocalization.rial}
            </p>

            <div className=" text-sm text-gray-700">
              <div className="flex gap-2 items-center">
                <p>{productsLocalization.expireDate}:</p>
                <p>{product.productExpired}</p>
              </div>
              {quantity < 5 && (
                <p
                  className={`mt-2 ${
                    isOutOfStock
                      ? "text-gray-500"
                      : "text-red-600 text-right mb-2"
                  }`}
                >
                  {isOutOfStock
                    ? "ناموجود"
                    : `فقط ${quantity} عدد در انبار موجود است`}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 justify-center">
                <button className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center hover:bg-red-700 transition duration-200 active:scale-90">
                  <BiCartAdd />
                </button>
                <span className="w-8 text-center font-bold text-lg">0</span>
                <button className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center hover:bg-amber-600 transition duration-200 active:scale-90">
                  <RiDeleteBin6Line />
                </button>
              </div>

              <Button
                children="افزودن به سبد خرید"
                onClick={function (): void {
                  throw new Error("Function not implemented.");
                }}
              />
            </div>
          </Link>
        );
      })}
    </div>
  );
}
