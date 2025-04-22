import BestSellerDrugs from "../components/store/home/best-seller/BestSeller";
import HeroBanner from "../components/store/home/heroBanner/HeroBanner";
import Navbar from "../components/store/home/navbar/Navbar";
import NewestDrugs from "../components/store/home/newest-drugs/NewsetDrugs";
import Offer from "../components/store/home/offers/Offer";
import Sliders from "../components/store/home/sliders/Sliders";

export default function Home() {
  return (
    <div className="w-full">
      <Navbar />
      <Sliders />
      <HeroBanner />
      <Offer />
      <BestSellerDrugs />
      <NewestDrugs />
    </div>
  );
}
