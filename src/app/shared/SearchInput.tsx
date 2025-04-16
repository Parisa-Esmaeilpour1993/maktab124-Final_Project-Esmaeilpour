import { FaArrowLeft, FaSearch } from "react-icons/fa";
import { faLocalization } from "../constants/localization/fa/localization";

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
export default function SearchInput({
  value,
  onChange,
  ...rest
}: SearchInputProps) {
  return (
    <div className="flex justify-center gap-2 items-center border border-gray-300 rounded-md px-2 p-1 w-80 md:w-[280px] lg:w-80 max-h-10 outline-none hover:border-[2px] hover:border-gray-600">
      <FaSearch color="black" size={13} />
      <input
        placeholder={faLocalization.search}
        value={value}
        onChange={onChange}
        className="w-72 outline-none text-sm pb-[2px]"
        {...rest}
      />
      <button className="cursor-pointer">
        <FaArrowLeft color="gray" size={13} />
      </button>
    </div>
  );
}
