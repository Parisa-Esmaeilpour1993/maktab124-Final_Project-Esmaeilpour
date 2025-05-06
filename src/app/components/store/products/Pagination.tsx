"use client";

import { faLocalization } from "@/app/constants/localization/fa/localization";
import { PaginationProps } from "@/app/types/pagination";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";

const Pagination = ({
  currentPage,
  totalItems,
  itemsPerPage,
}: PaginationProps) => {
  const totalPages = useMemo(() => {
    const total = itemsPerPage > 0 ? Math.ceil(totalItems / itemsPerPage) : 1;
    return isNaN(total) ? 1 : total;
  }, [totalItems, itemsPerPage]);

  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (page: number, limit: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    params.set("limit", limit.toString());
    router.push(`?${params.toString()}`);
  };

  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLimit = parseInt(e.target.value);
    handlePageChange(1, newLimit);
  };

  const getPageNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = [];

    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    pages.push(1);

    if (currentPage > 3) {
      pages.push("...");
    }

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 3) {
      pages.push("...");
    }

    pages.push(totalPages);

    return pages;
  };

  const pageNumbers = useMemo(getPageNumbers, [currentPage, totalPages]);

  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col lg:flex-row items-center justify-between mt-8 gap-4">
      <div className="flex gap-2 flex-wrap items-center justify-center md:justify-start text-[10px] md:text-sm lg:text-b">
        <button
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1, itemsPerPage)}
          className="px-2 py-1 border rounded disabled:opacity-50"
        >
          <span className="block md:hidden">&lt;</span>
          <span className="hidden md:block">{faLocalization.prev}</span>
        </button>

        {pageNumbers.map((num, index) =>
          typeof num === "string" ? (
            <span key={`dots-${index}`} className="px-3 py-1 text-gray-500">
              {num}
            </span>
          ) : (
            <button
              key={String(num)}
              onClick={() => handlePageChange(num, itemsPerPage)}
              className={`px-3 py-1 border rounded ${
                num === currentPage ? "bg-secondary text-white" : ""
              }`}
            >
              {num}
            </button>
          )
        )}

        <button
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1, itemsPerPage)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          <span className="block md:hidden">&gt;</span>
          <span className="hidden md:block">{faLocalization.next}</span>{" "}
        </button>
      </div>

      <div className="flex items-center gap-2 text-xs md:text-sm lg:text-base">
        <label htmlFor="perPage">{faLocalization.perPage}</label>
        <div className="border border-secondary px-1 rounded-md">
          <select
            id="perPage"
            value={itemsPerPage}
            onChange={handleLimitChange}
            className="outline-none"
          >
            {[1, 3, 6, 9, 12, 15, 18, 21, 24].map((limit) => (
              <option key={limit} value={limit} className="text-sm">
                {limit}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
