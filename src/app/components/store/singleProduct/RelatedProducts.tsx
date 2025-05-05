"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ProductsProps } from "@/app/types/products";
import { BASE_url } from "@/app/constants/api/BASE_URL";
import {
  faLocalization,
  productsLocalization,
} from "@/app/constants/localization/fa/localization";

interface RelatedProductsProps {
  products: ProductsProps[];
}

const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const getRandomProducts = (products: ProductsProps[], count: number) => {
  return shuffleArray(products).slice(0, count);
};

export default function RelatedProducts({ products }: RelatedProductsProps) {
  const [windowWidth, setWindowWidth] = useState<number>(0);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!products || products.length === 0) return null;

  let displayProducts = products;
  if (windowWidth >= 1024) {
    displayProducts =
      products.length > 4 ? getRandomProducts(products, 4) : products;
  } else if (windowWidth >= 768) {
    displayProducts =
      products.length > 3 ? getRandomProducts(products, 3) : products;
  } else {
    displayProducts =
      products.length > 2 ? getRandomProducts(products, 2) : products;
  }

  return (
    <div className="my-4 mx-8">
      <h2 className="text-xl font-semibold mb-4 border-b border-gray-400 pb-2">
        {productsLocalization.relativeProducts}
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {displayProducts.map((product) => (
          <Link key={product.id} href={`/singleProduct/${product.id}`}>
            <div className="border p-2 rounded-xl shadow hover:shadow-lg transition flex flex-col items-center justify-between">
              <div className="pb-4 px-4 pt-2">
                <img
                  src={`${BASE_url}${product.image}`}
                  alt={product.productName}
                  width={200}
                  height={200}
                  className="object-contain w-full h-40 bg-white rounded"
                />
              </div>
              <h3 className="text-sm font-semibold h-10 md:h-fit flex items-center justify-center">
                {product.productName}
              </h3>
              <p className="text-gray-600 text-sm mt-1 font-medium">
                {(+product.productPrice).toLocaleString()} {faLocalization.rial}
              </p>
              <h3 className="text-sm font-normal text-gray-500 mt-2">
                {productsLocalization.expireDate}
                {": "}
                <span dir="ltr"> {product.productExpired}</span>
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
