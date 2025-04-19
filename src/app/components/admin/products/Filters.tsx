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
        <option value="all" className="text-xs">
          {productsLocalization.allCategories}
        </option>
        {category?.map((cat) => (
          <option key={cat.id} value={cat.id} className="text-xs">
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
        <option value="all" className="text-xs">
          {productsLocalization.all}
        </option>
        <option value="unavailable" className="text-xs">
          {productsLocalization.unavailable}
        </option>
        <option value="low" className="text-xs">
          {productsLocalization.low}
        </option>
        <option value="enough" className="text-xs">
          {productsLocalization.enough}
        </option>
      </select>

      <select
        value={sortOption}
        onChange={(e) => setSortOption(e.target.value)}
        className="border-b-[3px] p-1 text-gray-700 border-secondary outline-none"
        size={1}
      >
        <option value="newest" className="text-xs">
          {productsLocalization.newest}
        </option>
        <option value="oldest" className="text-xs">
          {productsLocalization.oldest}
        </option>
        <option value="az" className="text-xs">
          {productsLocalization.az}
        </option>
        <option value="za" className="text-xs">
          {productsLocalization.za}
        </option>
      </select>
    </div>
  );
};

export default Filters;
