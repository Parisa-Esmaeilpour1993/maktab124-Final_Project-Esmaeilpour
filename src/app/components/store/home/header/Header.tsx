import logo from "@/app/assets/images/logo.png";
import { faLocalization } from "@/app/constants/localization/fa/localization";
import SearchInput from "@/app/shared/SearchInput";
import Image from "next/image";
import { FaRegUser } from "react-icons/fa";
import { AiOutlineShoppingCart } from "react-icons/ai";
import Link from "next/link";
import { cookies } from "next/headers";

const Header = async () => {
  const cookieStore = cookies();
  const fromAdmin = (await cookieStore).get("fromAdmin")?.value === "true";

  return (
    <header className="flex flex-col gap-6 md:flex-row justify-between items-center px-12 py-4">
      <div className="flex flex-col gap-2 items-center  justify-between lg:gap-6 md:flex-row">
        <Link href="/">
          <Image
            src={logo}
            alt={"logo"}
            height={72}
            className="cursor-pointer"
          />
        </Link>
        <SearchInput />
      </div>
      <div className="flex gap-3 justify-center items-center">
        <div className="flex justify-center items-center border border-gray-400 rounded-2xl  hover:scale-105 hover:border-gray-600">
          <AiOutlineShoppingCart
            size={32}
            className="bg-gray-100 p-[6px] rounded-2xl"
            color="gray"
          />
        </div>
        <Link href={fromAdmin ? "/admin" : "/login"}>
          <div className="flex justify-center items-center border border-gray-400 rounded-2xl hover:scale-105 hover:border-gray-600">
            <FaRegUser
              size={30}
              className="bg-gray-100 p-[7px] rounded-r-2xl"
              color="gray"
            />
            <button className="cursor-pointer bg-gray-100 text-gray-700 text-sm pl-3 pt-1 pb-2 rounded-l-2xl">
              {fromAdmin ? "مدیریت" : faLocalization.loginOrRegister}
            </button>
          </div>
        </Link>
      </div>
    </header>
  );
};

export default Header;
