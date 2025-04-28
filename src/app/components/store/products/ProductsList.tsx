import { IProducts } from "@/app/types/products";
import ProductCard from "./productCard";
import { faLocalization } from "@/app/constants/localization/fa/localization";
import moment from "jalali-moment";

export default function ProductsList({
  products,
  discountedProducts,
  favoriteProductIds,
  favoriteRecords,
  isLoading,
}: IProducts) {
  if (isLoading) {
    return (
      <div className="w-full flex justify-center items-center py-10 text-primary text-lg">
        <span className="animate-pulse">{faLocalization.loading}</span>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center text-gray-500 py-10 text-lg">
        {faLocalization.noProductFound}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {products.map((product) => {
        const discount = discountedProducts?.find(
          (item) => item.productName === product.productName
        );

        return (
          <ProductCard
            key={product.id}
            product={product}
            discount={discount}
            isFavorite={favoriteProductIds.includes(product.id)}
            favoriteRecords={favoriteRecords}
          />
        );
      })}
    </div>
  );
}
