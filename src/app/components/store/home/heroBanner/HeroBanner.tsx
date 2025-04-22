// app/components/Banner.tsx

import { getAuthToken } from "@/app/base/getAuthToken";
import { API_KEY, BASE_url } from "@/app/constants/api/BASE_URL";
import Image from "next/image";
import heroBanner from "@/app/assets/images/Green and White Modern Pharmacy Store Instagram Post.png";
import Button from "./CTA";

interface BannerItem {
  title: string;
  description: string;
  image: string;
}

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
    <section className="flex items-center justify-center mb-8">
      <div className="flex items-center justify-center px-28 py-8 rounded-2xl bg-light shadow-accent ">
        <div className="flex flex-col gap-3">
          <h1 className="text-2xl font-bold">{banner.title}</h1>
          <p className="text-lg mb-8 w-2/3">{banner.description}</p>
          <a href="/">
            <Button />
          </a>
        </div>
        <Image
          src={heroBanner}
          alt="heroBanner"
          width={400}
          className="rounded-2xl shadow-primary"
        />
      </div>
    </section>
  );
}
