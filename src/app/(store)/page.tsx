import HeroBanner from "../components/store/home/heroBanner/HeroBanner";
import Navbar from "../components/store/home/navbar/Navbar";
import Sliders from "../components/store/home/sliders/Sliders";

export default function Home() {
  return (
    <div className="w-full">
      <Navbar />
      <Sliders />
      <HeroBanner />
    </div>
  );
}
