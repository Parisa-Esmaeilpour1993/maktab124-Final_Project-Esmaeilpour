"use client";

import { useAppDispatch } from "@/app/redux/store/hooks";
import { fetchDiscountedProducts } from "@/app/services/fetchDiscountedProducts";
import { fetchProducts } from "@/app/services/fetchProducts";
import { favorites } from "@/app/services/getFavorites";
import { Discount, Filters, ProductsProps } from "@/app/types/products";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import Header from "./Header";
import Pagination from "./Pagination";
import ProductsList from "./ProductsList";
import Sidebar from "./Sidebar";

export default function ProductsPage() {
  const [allProducts, setAllProducts] = useState<ProductsProps[]>([]);
  const [products, setProducts] = useState<ProductsProps[]>([]);

  const [filter, setFilters] = useState<Filters>({
    availableOnly: false,
    categories: [],
    discountOnly: false,
    minPrice: 0,
    maxPrice: 0,
  });
  const [sort, setSort] = useState("newest");

  const [discountedProducts, setDiscountedProducts] = useState<
    { id: string; discountPercent: number; productName: string }[]
  >([]);

  const [favoriteProductIds, setFavoriteProductIds] = useState<string[]>([]);
  const [favoriteRecords, setFavoriteRecords] = useState<
    { id: string; productId: string }[]
  >([]);

  const [isLoading, setIsLoading] = useState(true);
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [totalItems, setTotalItems] = useState(0);

  const dispatch = useAppDispatch();

  const searchParams = useSearchParams();
  const categoryId = searchParams.get("category");
  const search = searchParams.get("search")?.trim().toLowerCase() || "";
  const currentPage = searchParams.get("page") || "1";
  const itemsPerPage = searchParams.get("limit") || "6";

  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    let needsUpdate = false;

    if (!params.get("page")) {
      params.set("page", "1");
      needsUpdate = true;
    }

    if (!params.get("limit")) {
      params.set("limit", "6");
      needsUpdate = true;
    }

    if (needsUpdate) {
      router.replace(`?${params.toString()}`);
    }
  }, []);

  useEffect(() => {
    if (categoryId) {
      setFilters((prev) => ({
        ...prev,
        categories: [categoryId],
      }));
    }
  }, [categoryId]);

  useEffect(() => {
    fetchDiscountedProducts().then((discountData) => {
      setDiscounts(discountData);
    });
  }, []);

  useEffect(() => {
    setIsLoading(true);

    dispatch(
      fetchProducts({
        filterKey: categoryId ? "productCategory" : undefined,
        filterValue: categoryId || undefined,
      })
    )
      .unwrap()
      .then((res) => {
        setAllProducts(res.records);
        setTotalItems(res.totalRecords);
      })
      .finally(() => setIsLoading(false));
  }, [categoryId, dispatch]);

  useEffect(() => {
    let data = [...allProducts];

    if (filter.availableOnly) {
      data = data.filter((p) => +p.productQuantity > 0);
    }

    if (filter.categories.length) {
      data = data.filter((p) => filter.categories.includes(p.productCategory));
    }

    if (search) {
      data = data.filter((p) => p.productName.toLowerCase().includes(search));
    }

    if (filter.minPrice || filter.maxPrice) {
      data = data.filter((p) => {
        const discountObj = discounts.find(
          (d) => d.productName === p.productName
        );
        const finalPrice = discountObj
          ? +p.productPrice * (1 - discountObj.discountPercent / 100)
          : +p.productPrice;

        const minCheck = filter.minPrice ? finalPrice >= filter.minPrice : true;
        const maxCheck = filter.maxPrice ? finalPrice <= filter.maxPrice : true;

        return minCheck && maxCheck;
      });
    }

    const matchedDiscounts = discounts
      .map((offProduct) => {
        const match = data.find(
          (product) => product.productName === offProduct.productName
        );
        return match
          ? {
              id: match.id,
              productName: match.productName,
              discountPercent: offProduct.discountPercent,
            }
          : null;
      })
      .filter(Boolean) as {
      id: string;
      productName: string;
      discountPercent: number;
    }[];

    setDiscountedProducts(matchedDiscounts);

    if (filter.discountOnly) {
      const discountNames = matchedDiscounts.map((d) => d.productName);
      data = data.filter((p) => discountNames.includes(p.productName));
    }

    const applySort = (dataToSort: ProductsProps[]) => {
      switch (sort) {
        case "newest":
          return [...dataToSort].sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "oldest":
          return [...dataToSort].sort(
            (a, b) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        case "alphabetical":
          return [...dataToSort].sort((a, b) =>
            a.productName.localeCompare(b.productName)
          );
        case "expensive":
          return [...dataToSort].sort(
            (a, b) => +b.productPrice - +a.productPrice
          );
        case "cheap":
          return [...dataToSort].sort(
            (a, b) => +a.productPrice - +b.productPrice
          );
        default:
          return dataToSort;
      }
    };

    const sorted = applySort(data);

    const currentPageNumber = parseInt(currentPage);
    const itemsPerPageNumber = parseInt(itemsPerPage);

    const startIndex = (currentPageNumber - 1) * itemsPerPageNumber;
    const endIndex = startIndex + itemsPerPageNumber;

    const maxPage = Math.ceil(data.length / itemsPerPageNumber);
    if (currentPageNumber > maxPage && maxPage > 0) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", maxPage.toString());
      router.replace(`?${params.toString()}`);
      return;
    }

    const paginated = sorted.slice(startIndex, endIndex);

    setProducts(paginated);
    setTotalItems(data.length);
  }, [filter, sort, search, discounts, allProducts, currentPage, itemsPerPage]);

  useEffect(() => {
    const fetchFavorites = async () => {
      const favData: { id: string; productId: string }[] = await favorites();
      setFavoriteProductIds(favData.map((fav) => fav.productId));
      setFavoriteRecords(favData);
    };

    fetchFavorites();
  }, []);

  return (
    <div>
      <ToastContainer />
      <div className="flex border-t border-secondary mx-4">
        <Sidebar filter={filter} setFilters={setFilters} />
        <main className="flex-1 p-6">
          <Header sort={sort} setSort={setSort} />
          <ProductsList
            products={products}
            discountedProducts={discountedProducts}
            favoriteProductIds={favoriteProductIds}
            favoriteRecords={favoriteRecords}
            isLoading={isLoading}
          />
          <Pagination
            currentPage={+currentPage}
            totalItems={+totalItems}
            itemsPerPage={+itemsPerPage}
          />
        </main>
      </div>
    </div>
  );
}
