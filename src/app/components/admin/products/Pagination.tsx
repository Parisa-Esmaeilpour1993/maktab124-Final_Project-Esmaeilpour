import { faLocalization } from "@/app/constants/localization/fa/localization";

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
  return (
    <div className="flex justify-center items-center mt-4 gap-4">
      <button
        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        disabled={currentPage === 1}
        className={`px-2 py-1 rounded-md border border-gray-600 ${
          currentPage === 1
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-white text-black hover:border-black hover:translate-y-0.5"
        }`}
      >
        {faLocalization.prev}
      </button>

      <span>
        {faLocalization.page}{" "}
        <span className="text-red-500">{currentPage}</span>{" "}
        {faLocalization.from} {totalPages}
      </span>

      <button
        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
        disabled={currentPage === totalPages}
        className={`px-2 py-1 rounded-md border border-gray-600 ${
          currentPage === totalPages
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-white text-black hover:border-black hover:translate-y-0.5"
        }`}
      >
        {faLocalization.next}
      </button>
    </div>
  );
};

export default Pagination;
