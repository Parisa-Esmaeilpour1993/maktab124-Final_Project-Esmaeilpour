import Navbar from "../components/store/navbar/Navbar";
import SearchInput from "../shared/SearchInput";
import { LayoutProps } from "../types/layout";

export default function StoreLayout({ children }: LayoutProps) {
  return (
    <div>
      <header>
        <h1>Pharmacy Header</h1>
        <Navbar />
        <SearchInput />
      </header>
      <main className="bg-red-300">{children}</main>
      <footer>Pharmacy Footer</footer>
    </div>
  );
}
