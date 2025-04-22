// components/Offer.tsx
import Image from "next/image";
import offer from "@/app/assets/images/offer.jpg";
import OfferSlider from "./Swipper";
import { API_KEY, BASE_url } from "@/app/constants/api/BASE_URL";
import { getAuthToken } from "@/app/base/getAuthToken";
import axios from "axios";

export async function getData() {
  const token = getAuthToken();
  const res = await axios(`${BASE_url}/api/records/offProducts`, {
    headers: {
      "Content-Type": "application/json",
      api_key: API_KEY,
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data.records;
}

export default async function Offer() {
  const products = await getData();

  return (
    <div className="flex justify-between gap-4 py-8 px-4 md:px-20">
      <div>
        <Image
          src={offer}
          alt="offer_banner"
          className="rounded-md h-[350px] md:h-[380px] lg:h-[420] w-[640px] lg:w-80"
        />
      </div>
      <OfferSlider products={products} />
    </div>
  );
}
