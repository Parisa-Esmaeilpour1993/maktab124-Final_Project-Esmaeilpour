import logo from "@/app/assets/images/logo.png";
import SearchInput from "@/app/shared/SearchInput";
import Image from "next/image";
import { AiOutlineShoppingCart } from "react-icons/ai";
import Link from "next/link";
import AuthButton from "./AuthButton";

const Header = async () => {
  return (
    <header className="flex flex-col gap-6 md:flex-row justify-between items-center px-12 py-4">
      <div className="flex flex-col gap-2 items-center justify-between lg:gap-6 md:flex-row">
        <Link href="/">
          <Image src={logo} alt="logo" height={72} className="cursor-pointer" />
        </Link>
        <SearchInput />
      </div>

      <div className="flex gap-3 justify-center items-center">
        <div className="flex justify-center items-center border border-primary rounded-2xl hover:scale-105 hover:border-primary">
          <AiOutlineShoppingCart
            size={32}
            className="bg-light p-[6px] rounded-2xl text-primary"
          />
        </div>
        <AuthButton />
      </div>
    </header>
  );
};

export default Header;
