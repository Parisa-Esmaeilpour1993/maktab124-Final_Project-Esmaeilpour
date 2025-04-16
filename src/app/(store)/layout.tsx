import Header from "../components/store/home/header/Header";

import { LayoutProps } from "../types/layout";

export default function StoreLayout({ children }: LayoutProps) {
  return (
    <div>
      <Header />
      <main>{children}</main>
      <footer>Pharmacy Footer</footer>
    </div>
  );
}
