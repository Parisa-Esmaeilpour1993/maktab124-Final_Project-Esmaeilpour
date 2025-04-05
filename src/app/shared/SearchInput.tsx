import React from "react";
import { faLocalization } from "../constants/localization/fa/localization";
import { FaArrowLeft, FaSearch } from "react-icons/fa";

function SearchInput() {
  return (
    <div className="flex justify-center gap-2 items-center border border-gray-300 rounded-md px-2 p-1 w-80 max-h-10 outline-none hover:border-[2px] hover:border-gray-600">
      <FaSearch color="black" size={13} />
      <input
        placeholder={faLocalization.search}
        className="w-72 outline-none text-sm pb-[2px]"
      />
      <button className="cursor-pointer">
        <FaArrowLeft color="gray" size={13} />
      </button>
    </div>
  );
}

export default SearchInput;
