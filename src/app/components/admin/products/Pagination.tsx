import { faLocalization } from "@/app/constants/localization/fa/localization";
import { useState } from "react";

interface PaginationProps {
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
}
const Pagination = ({
  currentPage,
  setCurrentPage,
  totalPages,
}: PaginationProps) => {
  const [inputValue, setInputValue] = useState(
    currentPage ? currentPage.toString() : "1"
  );

  const updatePage = (page: number) => {
    setCurrentPage(page);
    setInputValue(page.toString());
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setInputValue(value);
    }
  };

  const handleInputBlurOrEnter = () => {
    const page = parseInt(inputValue, 10);
    if (page >= 1 && page <= totalPages) {
      updatePage(page);
    } else {
      setInputValue(currentPage.toString());
    }
  };

  return (
    <div className="flex justify-center items-center mt-4 gap-4 text-sm">
      <button
        onClick={() => updatePage(1)}
        disabled={currentPage === 1}
        className={`px-2 py-1 rounded-md border border-accent ${
          currentPage === 1
            ? "bg-light text-secondary cursor-not-allowed"
            : "bg-accent text-white hover:border-primary hover:translate-y-0.5"
        }`}
      >
        {faLocalization.first}
      </button>
      <button
        onClick={() => {
          const newPage = Math.max(currentPage - 1, 1);
          updatePage(newPage);
        }}
        disabled={currentPage === 1}
        className={`px-2 py-1 rounded-md border border-accent ${
          currentPage === 1
            ? "bg-light text-secondary cursor-not-allowed"
            : "bg-accent text-white hover:border-primary hover:translate-y-0.5"
        }`}
      >
        {faLocalization.prev}
      </button>

      <span>
        {faLocalization.page}{" "}
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlurOrEnter}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleInputBlurOrEnter();
            }
          }}
          className="w-8 text-center border border-light outline-none rounded px-1 text-red-500"
        />{" "}
        {faLocalization.from} {totalPages}
      </span>

      <button
        onClick={() => {
          const newPage = Math.min(currentPage + 1, totalPages);
          updatePage(newPage);
        }}
        disabled={currentPage === totalPages}
        className={`px-2 py-1 rounded-md border border-accent ${
          currentPage === totalPages
            ? "bg-light text-secondary cursor-not-allowed"
            : "bg-accent text-white hover:border-primary hover:translate-y-0.5"
        }`}
      >
        {faLocalization.next}
      </button>
      <button
        onClick={() => updatePage(totalPages)}
        disabled={currentPage === totalPages}
        className={`px-2 py-1 rounded-md border border-accent ${
          currentPage === totalPages
            ? "bg-light text-secondary cursor-not-allowed"
            : "bg-accent text-white hover:border-primary hover:translate-y-0.5"
        }`}
      >
        {faLocalization.end}
      </button>
    </div>
  );
};

export default Pagination;
