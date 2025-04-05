import logo from "@/app/assets/images/logo.png";
import { faLocalization } from "@/app/constants/localization/fa/localization";
import SearchInput from "@/app/shared/SearchInput";
import Image from "next/image";
import { FaShoppingCart, FaUser } from "react-icons/fa";

const Header = () => {
  return (
    <header className="flex flex-col gap-2 lg:flex-row justify-between items-center px-12 py-4">
      <div className="flex flex-col gap-2 items-center  justify-between md:gap-6 md:flex-row">
        <Image src={logo} alt={"logo"} height={72} />
        <SearchInput />
      </div>
      <div className="flex gap-4 justify-center items-center">
        <div className="flex justify-center items-center px-2 py-1 hover:scale-105">
          <FaShoppingCart
            size={32}
            className="bg-gray-500 p-[6px] rounded-r-md"
            color="white"
          />
          <button className="cursor-pointer bg-gray-300 text-white text-sm pr-2 pl-1 pb-2 pt-1">
            {faLocalization.cart}
          </button>
          <span className="bg-gray-300 p-1 rounded-l-md text-[10px] pl-2">
            <div className="size-6 bg-gray-500 rounded-full flex items-center justify-center text-white">
              0
            </div>
          </span>
        </div>
        <div className="flex justify-center items-center px-2 py-1 hover:scale-105">
          <FaUser
            size={30}
            className="bg-gray-500 p-[6px] rounded-r-md"
            color="white"
          />
          <button className="cursor-pointer bg-gray-300 text-white text-sm px-2 pt-1 pb-[6px] rounded-l-md">
            {faLocalization.loginOrRegister}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
