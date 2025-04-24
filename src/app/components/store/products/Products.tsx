"use client";
import { useAppDispatch } from "@/app/redux/store/hooks";
import { fetchProducts } from "@/app/services/fetchProducts";
import { Discount, Filters, ProductsProps } from "@/app/types/products";
import { useEffect, useState } from "react";
import Header from "./Header";
import ProductsList from "./ProductsList";
import Sidebar from "./Sidebar";
import { fetchDiscountedProducts } from "@/app/services/fetchDiscountedProducts";
import { favorites } from "@/app/services/getFavorites";
import { ToastContainer } from "react-toastify";
import { useSearchParams } from "next/navigation";

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductsProps[]>([]);
  const [filter, setFilters] = useState<Filters>({
    availableOnly: false,
    categories: [],
    discountOnly: false,
  });
  const [sort, setSort] = useState("newest");
  const [discountedProducts, setDiscountedProducts] = useState<
    { id: string; discountPercent: number; productName: string }[]
  >([]);
  const [favoriteProductIds, setFavoriteProductIds] = useState<string[]>([]);
  const [favoriteRecords, setFavoriteRecords] = useState<
    { id: string; productId: string }[]
  >([]);
  // const [isLoading, setIsLoading] = useState(true);

  const [Discounts, setDiscounts] = useState<Discount[]>([]);
  const dispatch = useAppDispatch();

  const searchParams = useSearchParams();
  const categoryId = searchParams.get("category");
  const search = searchParams.get("search")?.trim().toLowerCase() || "";

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
    // setIsLoading(true);
    dispatch(
      fetchProducts(
        categoryId
          ? { filterKey: "productCategory", filterValue: categoryId }
          : undefined
      )
    )
      .unwrap()
      .then((res) => {
        let data = res;

        if (filter.availableOnly) {
          data = data.filter((p) => +p.productQuantity > 0);
        }

        if (filter.categories.length) {
          data = data.filter((p) =>
            filter.categories.includes(p.productCategory)
          );
        }

        if (search) {
          data = data.filter((p) =>
            p.productName.toLowerCase().includes(search)
          );
        }

        const applySort = (dataToSort: ProductsProps[]) => {
          switch (sort) {
            case "newest":
              return [...dataToSort].sort(
                (a, b) =>
                  new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime()
              );
            case "oldest":
              return [...dataToSort].sort(
                (a, b) =>
                  new Date(a.createdAt).getTime() -
                  new Date(b.createdAt).getTime()
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

        const matchedDiscounts = Discounts.map((offProduct) => {
          const match = data.find(
            (product) => product.productName === offProduct.productName
          );
          return match
            ? {
                productName: match.productName,
                discountPercent: offProduct.discountPercent,
              }
            : null;
        }).filter(Boolean) as {
          id: string;
          productName: string;
          discountPercent: number;
        }[];

        setDiscountedProducts(matchedDiscounts);

        if (filter.discountOnly) {
          const discountIds = matchedDiscounts.map((d) => d.productName);
          const discounted = data.filter((p) =>
            discountIds.includes(p.productName)
          );
          setProducts(applySort(discounted));
          return;
        }

        setProducts(applySort(data));
      });
    // .finally(() => setIsLoading(false));
  }, [filter, sort, Discounts, search]);

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
      <div className="flex border-t border-secondary">
        <Sidebar filter={filter} setFilters={setFilters} />
        <main className="flex-1 p-6">
          <Header sort={sort} setSort={setSort} />
          <ProductsList
            products={products}
            discountedProducts={discountedProducts}
            favoriteProductIds={favoriteProductIds}
            favoriteRecords={favoriteRecords}
            // isLoading={isLoading}
          />
        </main>
      </div>
    </div>
  );
}
