// app/components/Banner.tsx

import { getAuthToken } from "@/app/base/getAuthToken";
import { API_KEY, BASE_url } from "@/app/constants/api/BASE_URL";
import Image from "next/image";
import heroBanner from "@/app/assets/images/Green and White Modern Pharmacy Store Instagram Post.png";
import Button from "./CTA";

interface BannerItem {
  title: string;
  description: string;
  link: string;
  image: string;
  background: string;
  isActive?: boolean;
  order: number;
}

export default async function Banner() {
  const token = getAuthToken();

  const res = await fetch(`${BASE_url}/api/records/banners`, {
    headers: {
      "Content-Type": "application/json",
      api_key: API_KEY,
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json();
  const banner: BannerItem = data.records?.[0];

  if (!banner?.isActive) return null;

  return (
    <section className="w-full flex items-center justify-center">
      <div className="p-8 flex items-center justify-center w-2/3 gap-24">
        <div className="flex flex-col gap-3">
          <h1 className="text-2xl font-bold">{banner.title}</h1>
          <p className="text-lg mb-8">{banner.description}</p>
          <a href={banner.link}>
            <Button />
          </a>
        </div>
        <Image src={heroBanner} alt="heroBanner" width={400} />
      </div>
    </section>
  );
}
