import HeroBanner from "../components/store/home/heroBanner/HeroBanner";
import Navbar from "../components/store/home/navbar/Navbar";

export default function Home() {
  return (
    <div className="w-full">
      <Navbar />
      <HeroBanner />
    </div>
  );
}
