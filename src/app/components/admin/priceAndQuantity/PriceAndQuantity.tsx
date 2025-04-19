"use client";

import { getAuthToken } from "@/app/base/getAuthToken";
import Filters from "@/app/components/admin/products/Filters";
import Pagination from "@/app/components/admin/products/Pagination";
import { productsLocalization } from "@/app/constants/localization/fa/localization";
import useFetchCategories from "@/app/hooks/useCategories";
import useFilteredProducts from "@/app/hooks/useFilteredProducts";
import { AppDispatch, RootState } from "@/app/redux/store";
import { editProduct } from "@/app/services/editProducts";
import { fetchProducts } from "@/app/services/fetchProducts";
import SearchInput from "@/app/shared/SearchInput";
import { ProductsProps } from "@/app/types/products";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProductTable from "./ProductTable";

export default function PriceAndQuantity() {
  const token = getAuthToken();
  const dispatch = useDispatch<AppDispatch>();
  const { products, loading } = useSelector(
    (state: RootState) => state.products
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStock, setFilterStock] = useState("all");
  const [sortOption, setSortOption] = useState("newest");
  const filteredProducts = useFilteredProducts({
    products,
    searchTerm,
    filterCategory,
    filterStock,
    sortOption,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const { categories } = useFetchCategories();

  useEffect(() => {
    if (token) {
      dispatch(fetchProducts());
    }
  }, [token, dispatch]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  const handleInlineEdit = async (id: string, field: string, value: string) => {
    try {
      const productToEdit = products.find((p) => p.id === id);
      if (!productToEdit) return;
      const updatedProduct: ProductsProps = {
        ...productToEdit,
        [field]:
          field === "productPrice" || field === "productQuantity"
            ? Number(value)
            : value,
      };
      await dispatch(editProduct(updatedProduct));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="px-4 mt-6">
      <ToastContainer />
      <div className="flex flex-col items-center gap-4 justify-between">
        <SearchInput
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Filters
          filterCategory={filterCategory}
          filterStock={filterStock}
          sortOption={sortOption}
          setFilterCategory={setFilterCategory}
          setFilterStock={setFilterStock}
          setSortOption={setSortOption}
          category={categories}
        />
      </div>

      {loading ? (
        <div className="w-full text-center py-10 text-lg font-semibold flex items-center justify-center gap-2">
          <div className="w-6 h-6 border-t-4 border-secondary border-solid rounded-full animate-spin "></div>
          {productsLocalization.loading}...
        </div>
      ) : (
        <ProductTable
          products={paginatedProducts}
          category={categories}
          onInlineEdit={handleInlineEdit}
        />
      )}

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
        />
      )}
    </div>
  );
}
