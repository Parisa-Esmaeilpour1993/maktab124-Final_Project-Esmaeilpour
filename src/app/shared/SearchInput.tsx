import { FaArrowLeft, FaSearch } from "react-icons/fa";
import { faLocalization } from "../constants/localization/fa/localization";

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  // isLoading?: boolean;
}
export default function SearchInput({
  value,
  onChange,
  // isLoading = false,
  ...rest
}: SearchInputProps) {
  return (
    <div className="flex justify-center gap-2 items-center border-2 border-accent rounded-md px-2 p-1 w-80 md:w-[280px] lg:w-80 max-h-10 outline-none hover:border-[3px] hover:border-secondary text-primary">
      <FaSearch className="text-secondary" size={13} />
      <input
        placeholder={faLocalization.search}
        value={value}
        onChange={onChange}
        className="w-72 outline-none text-sm pb-[2px]"
        {...rest}
      />
      <button className="cursor-pointer">
        {/* {isLoading ? (
          <div className="animate-spin">
            <FaArrowLeft className="text-secondary" size={13} />
          </div>
        ) : (
          <FaArrowLeft className="text-secondary" size={13} />
        )} */}
        <FaArrowLeft className="text-secondary" size={13} />
      </button>
    </div>
  );
}
