// app/components/Banner.tsx

import { getAuthToken } from "@/app/base/getAuthToken";
import { API_KEY, BASE_url } from "@/app/constants/api/BASE_URL";
import Image from "next/image";
import heroBanner from "@/app/assets/images/Green and White Modern Pharmacy Store Instagram Post.png";
import Button from "./CTA";
import { BannerItem } from "@/app/types/Banner";

export default async function Banner() {
  const token = getAuthToken();

  const res = await fetch(`${BASE_url}/api/records/heroBanner`, {
    headers: {
      "Content-Type": "application/json",
      api_key: API_KEY,
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json();
  const banner: BannerItem = data.records?.[0];

  return (
    <div className="w-full flex items-center justify-center">
      <div className="flex items-center justify-center px-10 lg:px-20 py-8 w-5/6 rounded-2xl shadow-accent bg-light">
        <div className="flex flex-col gap-3">
          <h1 className="text-lg md:text-xl lg:text-2xl font-bold">
            {banner.title}
          </h1>
          <p className="text-[16px] md:text-lg mb-8 w-full lg:w-2/3">
            {banner.description}
          </p>
          <a href="/">
            <Button />
          </a>
        </div>
        <Image
          src={heroBanner}
          alt="heroBanner"
          className="rounded-2xl shadow-primary hidden md:block md:w-1/3"
        />
      </div>
    </div>
  );
}
