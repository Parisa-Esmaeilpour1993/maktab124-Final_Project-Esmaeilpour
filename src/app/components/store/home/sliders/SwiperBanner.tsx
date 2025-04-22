"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { BASE_url } from "@/app/constants/api/BASE_URL";
import { BannerProps } from "@/app/types/Banner";

interface Props {
  banners: BannerProps[];
}

export default function SwiperBanner({ banners }: Props) {
  return (
    <section className="w-full py-6 px-4 md:px-12 lg:px-20">
      <div className="max-w-[1400px] mx-auto rounded-xl overflow-hidden relative">
        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          spaceBetween={10}
          slidesPerView={1}
          navigation
          loop
          autoplay={{ delay: 4000 }}
          pagination={{ clickable: true }}
          className="swiper-banner"
        >
          {banners?.map((banner) => (
            <SwiperSlide key={banner.id}>
              <div
                className="h-[380px] bg-center bg-cover relative"
                style={{
                  backgroundImage: `url(${BASE_url}${banner.background})`,
                }}
              >
                <div className="absolute inset-0 flex px-32">
                  <div className="text-white text-right mt-16 max-w-[50%]">
                    <h2 className="text-3xl font-bold mb-2">{banner.title}</h2>
                    <p className="text-lg">{banner.description}</p>
                  </div>
                </div>
                <div className="absolute bottom-4 left-8 px-12">
                  <img
                    src={`${BASE_url}${banner.image}`}
                    alt=""
                    className="w-[200px] md:w-[320px]"
                  />
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
