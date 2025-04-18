// useFilteredProducts.ts
import { useState, useEffect } from "react";
import { ProductsProps } from "@/app/types/products";

interface UseFilteredProductsProps {
  products: ProductsProps[];
  searchTerm: string;
  filterCategory: string;
  filterStock: string;
  sortOption: string;
}

const useFilteredProducts = ({
  products,
  searchTerm,
  filterCategory,
  filterStock,
  sortOption,
}: UseFilteredProductsProps) => {
  const [filteredProducts, setFilteredProducts] = useState<ProductsProps[]>([]);

  useEffect(() => {
    let filtered = [...products];

    if (searchTerm)
      filtered = filtered.filter((p) =>
        p.productName.toLowerCase().includes(searchTerm.toLowerCase())
      );

    if (filterCategory !== "all")
      filtered = filtered.filter((p) => p.productCategory === filterCategory);

    if (filterStock === "low")
      filtered = filtered.filter(
        (p) => +p.productQuantity < 10 && +p.productQuantity > 0
      );
    else if (filterStock === "enough")
      filtered = filtered.filter((p) => +p.productQuantity >= 10);
    else if (filterStock === "unavailable")
      filtered = filtered.filter((p) => +p.productQuantity === 0);

    if (sortOption === "az")
      filtered.sort((a, b) => a.productName.localeCompare(b.productName, "fa"));
    else if (sortOption === "za")
      filtered.sort((a, b) => b.productName.localeCompare(a.productName, "fa"));
    else if (sortOption === "newest")
      filtered.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    else if (sortOption === "oldest")
      filtered.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );

    setFilteredProducts(filtered);
  }, [products, searchTerm, filterCategory, filterStock, sortOption]);

  return filteredProducts;
};

export default useFilteredProducts;
