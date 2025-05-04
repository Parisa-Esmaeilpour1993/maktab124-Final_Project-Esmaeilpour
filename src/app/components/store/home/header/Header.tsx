"use client";
import logo from "@/app/assets/images/logo.png";
import SearchInput from "@/app/shared/SearchInput";
import Image from "next/image";
import { AiOutlineShoppingCart } from "react-icons/ai";
import Link from "next/link";
import AuthButton from "./AuthButton";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useSelector } from "react-redux";

const Header = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [inputValue, setInputValue] = useState(
    searchParams.get("search") || ""
  );

  const itemTypesCount = useSelector((state: any) => state.cart.items.length);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const params = new URLSearchParams(searchParams.toString());
    if (inputValue.trim()) {
      params.set("search", inputValue.trim());
    } else {
      params.delete("search");
    }
    router.push(`/products?${params.toString()}`);
  };

  return (
    <header className="flex flex-col gap-6 md:flex-row justify-between items-center px-12 py-4">
      <div className="flex flex-col gap-2 items-center justify-between lg:gap-6 md:flex-row">
        <Link href="/" onClick={() => setInputValue("")}>
          <Image src={logo} alt="logo" height={80} className="cursor-pointer" />
        </Link>
        <form onSubmit={handleSearchSubmit}>
          <SearchInput value={inputValue} onChange={handleSearchChange} />
        </form>
      </div>

      <div className="relative flex gap-2 justify-center items-center">
        <Link
          className="flex justify-center items-center border border-primary rounded-2xl hover:scale-105 hover:border-primary"
          href={"/cart"}
        >
          <AiOutlineShoppingCart
            size={32}
            className="bg-light p-[6px] rounded-2xl text-primary"
          />
          {itemTypesCount > 0 && (
            <span className="absolute -top-3 -right-3 bg-accent text-white text-xs rounded-full w-6 h-6 flex items-center justify-center z-50">
              {itemTypesCount}
            </span>
          )}
        </Link>
        <AuthButton />
      </div>
    </header>
  );
};

export default Header;
