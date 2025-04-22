// components/store/home/sliders/Sliders.tsx

import { getBanners } from "./getBanners";
import SwiperBannerWrapper from "./SwiperBannerWrapper";

export default async function Sliders() {
  const banners = await getBanners();

  return (
    <section className="my-10">
      <SwiperBannerWrapper banners={banners} />
    </section>
  );
}
