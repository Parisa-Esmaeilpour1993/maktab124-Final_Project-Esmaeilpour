"use client";

import { API_KEY, BASE_url } from "@/app/constants/api/BASE_URL";
import Button from "@/app/shared/Button";
import { ProductsProps } from "@/app/types/products";
import { FaHeart, FaShoppingCart } from "react-icons/fa";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  faLocalization,
  productsLocalization,
} from "@/app/constants/localization/fa/localization";
import Link from "next/link";

export default function NewestDrugsSlider({
  products,
}: {
  products: ProductsProps[];
}) {
  const [allDrugs, setAllDrugs] = useState<ProductsProps[]>([]);

  useEffect(() => {
    fetch(`${BASE_url}/api/records/drugs`, { headers: { api_key: API_KEY } })
      .then((res) => res.json())
      .then((data) => setAllDrugs(data.records));
  }, []);

  const getProductIdByName = (name: string) => {
    const matched = allDrugs?.find((drug) => drug.productName === name);
    return matched?.id || null;
  };

  const formatPrice = (price: number) =>
    price.toLocaleString("fa-IR") + faLocalization.rial;

  return (
    <Swiper
      modules={[Navigation]}
      navigation={false}
      slidesPerView={3}
      spaceBetween={10}
      breakpoints={{
        0: { slidesPerView: 1.2 },
        640: { slidesPerView: 2.2 },
        1024: { slidesPerView: 3.2 },
        1280: { slidesPerView: 3.8 },
      }}
    >
      {products.map((product) => {
        const [animate, setAnimate] = useState(false);

        return (
          <SwiperSlide key={product.id}>
            <Link
              href={`/singleProduct/${getProductIdByName(product.productName)}`}
            >
              <div className="border border-secondary rounded-xl py-3 px-5 bg-white shadow-sm hover:shadow-md transition-all h-full w-full hover:border-primary hover:border-[3px] cursor-pointer">
                <div className="p-4">
                  <img
                    src={`${BASE_url}${product.image}`}
                    alt={product.productName}
                    className="rounded-lg object-contain w-full h-[100px] md:h-36 mb-2 lg:mb-2"
                  />
                </div>

                <h3 className="text-base font-bold h-12 line-clamp-2 text-gray-800 mb-2">
                  {product.productName}
                </h3>

                <div className="text-sm text-gray-600 h-10 line-clamp-2 mb-2 lg:mb-4">
                  {product.productDescription}
                </div>

                <div className="flex flex-col xl:flex-row justify-center items-center gap-1 xl:pt-2">
                  <span className="text-gray-400 text-sm">
                    {formatPrice(+product.productPrice)}
                  </span>
                </div>

                <div className="flex justify-center gap-2 mt-2 lg:mt-4">
                  <Button
                    onClick={function (): void {
                      throw new Error("Function not implemented.");
                    }}
                    className="flex items-center gap-2 justify-center !px-2"
                  >
                    {" "}
                    <FaShoppingCart className="block lg:hidden xl:block" />
                    <span className="hidden lg:inline lg:text-[12px] xl:text-sm">
                      {productsLocalization.addToCart}
                    </span>
                  </Button>
                  <button
                    onClick={() => {
                      setAnimate(true);
                      setTimeout(() => setAnimate(false), 500);
                    }}
                    className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 rounded-md flex items-center gap-1"
                  >
                    <motion.div
                      animate={animate ? { scale: [1, 1.4, 0.9, 1.2, 1] } : {}}
                      transition={{ duration: 0.5 }}
                    >
                      <FaHeart />
                    </motion.div>
                  </button>
                </div>
              </div>
            </Link>
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
}
