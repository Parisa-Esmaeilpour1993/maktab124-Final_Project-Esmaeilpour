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
    <div className="grid grid-cols-5 md:grid-cols-4 lg:grid-cols-5 gap-4 py-8 px-4 md:px-20 items-stretch">
      <div className="col-span-2 md:col-span-1 lg:col-span-1">
        <div className="w-full h-full min-h-full">
          <Image
            src={offer}
            alt="offer_banner"
            className="w-full h-full object-cover rounded-md xl:h-[410px]"
            width={500}
          />
        </div>
      </div>

      <div className="col-span-3 md:col-span-3 lg:col-span-4">
        <div className="w-full h-full min-h-full">
          <OfferSlider products={products} />
        </div>
      </div>
    </div>
  );
}
