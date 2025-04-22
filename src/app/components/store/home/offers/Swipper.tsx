// components/OfferSlider.tsx
"use client";

import { BASE_url } from "@/app/constants/api/BASE_URL";
import Button from "@/app/shared/Button";
import { ProductsProps } from "@/app/types/products";
import { FaHeart, FaShoppingCart, FaTag } from "react-icons/fa";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { motion } from "framer-motion";
import { useState } from "react";
import { faLocalization } from "@/app/constants/localization/fa/localization";
import { MdAddShoppingCart } from "react-icons/md";

export default function OfferSlider({
  products,
}: {
  products: ProductsProps[];
}) {
  const formatPrice = (price: number) =>
    price.toLocaleString("fa-IR") + faLocalization.rial;

  const calculateDiscountedPrice = (price: number, percent: number) =>
    Math.round(price * (1 - percent / 100));

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
        const discountedPrice = calculateDiscountedPrice(
          product.productPrice === "" ? 0 : product.productPrice,
          product.discountPercent ?? 0
        );
        const [animate, setAnimate] = useState(false);

        return (
          <SwiperSlide key={product.id} className="">
            <div className="relative border border-secondary rounded-xl py-3 px-5 bg-white shadow-sm hover:shadow-md transition-all h-full w-full">
              <div className="absolute top-2 right-2 bg-amber-500 text-white px-2 py-1 text-sm rounded-md flex items-center gap-1 z-10 animate-pulseGlow">
                <FaTag />
                <span className="pt-[2px]">{product.discountPercent}٪</span>
              </div>

              <img
                src={`${BASE_url}${product.image}`}
                alt={product.productName}
                className="rounded-lg object-contain w-full h-[120px] md:h-36 lg:h-40 mb-4"
              />

              <h3 className="text-base font-bold h-12 line-clamp-2 text-gray-800 mb-2">
                {product.productName}
              </h3>

              <div className="text-sm text-gray-600 h-10 line-clamp-2 mb-2 lg:mb-4">
                {product.productDescription}
              </div>

              <div className="flex flex-col xl:flex-row items-center gap-1 xl:pt-4">
                <span className="text-gray-400 line-through text-sm">
                  {formatPrice(+product.productPrice)}
                </span>
                <span className="text-secondary font-bold text-base">
                  {formatPrice(discountedPrice)}
                </span>
              </div>

              <div className="flex justify-center gap-2 mt-2 lg:mt-4">
                <Button
                  onClick={function (): void {
                    throw new Error("Function not implemented.");
                  }}
                  className="flex items-center gap-2 justify-center"
                >
                  {" "}
                  <FaShoppingCart className="block lg:hidden xl:block" />
                  <span className="hidden lg:inline lg:text-[13px] xl:text-[16px]">
                    افزودن به سبد
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
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
}
