import Footer from "../components/store/home/footer/Footer";
import Header from "../components/store/home/header/Header";
import { LayoutProps } from "../types/layout";

export default function StoreLayout({ children }: LayoutProps) {
  return (
    <div>
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
