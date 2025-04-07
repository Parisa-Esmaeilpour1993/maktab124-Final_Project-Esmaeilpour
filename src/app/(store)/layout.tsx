import Header from "../components/store/home/header/Header";
import Navbar from "../components/store/home/navbar/Navbar";

import { LayoutProps } from "../types/layout";

export default function StoreLayout({ children }: LayoutProps) {
  return (
    <div>
      <Header />
      <Navbar />
      <main>{children}</main>
      <footer>Pharmacy Footer</footer>
    </div>
  );
}
