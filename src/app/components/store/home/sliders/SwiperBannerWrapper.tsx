"use client";
import { BannerProps } from "@/app/types/Banner";
import dynamic from "next/dynamic";

const SwiperBanner = dynamic(() => import("./SwiperBanner"), {
  ssr: false,
});

interface Props {
  banners: BannerProps[];
}
export default function SwiperBannerWrapper({ banners }: Props) {
  return <SwiperBanner banners={banners} />;
}
