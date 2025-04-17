import React from "react";
import { productsLocalization } from "@/app/constants/localization/fa/localization";
import { ProductsFilterProps } from "@/app/types/products";

const Filters = ({
  filterCategory,
  filterStock,
  sortOption,
  setFilterCategory,
  setFilterStock,
  setSortOption,
  category,
}: ProductsFilterProps) => {
  return (
    <div className="flex flex-col md:flex-row flex-wrap gap-4 w-full md:w-auto mb-6">
      <select
        value={filterCategory}
        onChange={(e) => setFilterCategory(e.target.value)}
        className="border-b-[3px] p-1 text-gray-700 border-secondary outline-none"
        size={1}
      >
        <option value="all">{productsLocalization.allCategories}</option>
        {category?.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.title}
          </option>
        ))}
      </select>

      <select
        value={filterStock}
        onChange={(e) => setFilterStock(e.target.value)}
        className="border-b-[3px] p-1 text-gray-700 border-secondary outline-none"
        size={1}
      >
        <option value="all">{productsLocalization.all}</option>
        <option value="unavailable">{productsLocalization.unavailable}</option>
        <option value="low">{productsLocalization.low}</option>
        <option value="enough">{productsLocalization.enough}</option>
      </select>

      <select
        value={sortOption}
        onChange={(e) => setSortOption(e.target.value)}
        className="border-b-[3px] p-1 text-gray-700 border-secondary outline-none"
        size={1}
      >
        <option value="newest">{productsLocalization.newest}</option>
        <option value="oldest">{productsLocalization.oldest}</option>
      </select>
    </div>
  );
};

export default Filters;
