"use client";

import { faLocalization } from "@/app/constants/localization/fa/localization";
import { useAppDispatch, useAppSelector } from "@/app/redux/store/hooks";
import { fetchCategories } from "@/app/services/fetchCategory";
import axios from "axios";
import { useEffect, useRef, useState } from "react";

import { API_KEY, BASE_url } from "@/app/constants/api/BASE_URL";
import { ProductsProps } from "@/app/types/products";
import Link from "next/link";

export default function Navbar() {
  const dispatch = useAppDispatch();
  const { categories } = useAppSelector((state) => state.categories);
  const [drugs, setDrugs] = useState<ProductsProps[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [hoveredCategoryId, setHoveredCategoryId] = useState<string | null>(
    null
  );
  const navbarRef = useRef<HTMLDivElement>(null);
  const [hasScroll, setHasScroll] = useState(false);

  useEffect(() => {
    const checkScroll = () => {
      const el = navbarRef.current;
      if (el) {
        setHasScroll(el.scrollWidth > el.clientWidth);
      }
    };

    checkScroll();

    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, []);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleCategoryMouseEnter = (categoryId: string) => {
    setHoveredCategoryId(categoryId);
    setLoading(true);

    axios
      .get(`${BASE_url}/api/records/drugs`, {
        headers: {
          api_key: API_KEY,
        },
      })
      .then((response) => {
        const filteredDrugs: ProductsProps[] = response.data.records.filter(
          (drug: ProductsProps) => drug.productCategory === categoryId
        );
        setDrugs(filteredDrugs);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching drugs:", error);
        setLoading(false);
      });
  };

  const handleCategoryMouseLeave = () => {
    setHoveredCategoryId(null);
  };

  const handleCategoryClick = (categoryId: string) => {
    setHoveredCategoryId(categoryId);
    setLoading(true);

    axios
      .get(
        `${BASE_url}/api/records/drugs?filterValue=${categoryId}&filterKey=productCategory`,
        {
          headers: {
            api_key: API_KEY,
          },
        }
      )
      .then((response) => {
        const filteredDrugs: ProductsProps[] = response.data.records;
        setDrugs(filteredDrugs);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching drugs:", error);
        setLoading(false);
      });
  };

  return (
    <nav className=" z-40 font-medium text-gray-800 mx-4 mb-4 px-4 py-3 border-b border-accent rounded-2xl shadow-accent sticky top-2 bg-white">
      <div
        ref={navbarRef}
        className={`flex gap-6 overflow-x-auto whitespace-nowrap custom-scrollbar transition-all duration-300 ${
          hasScroll ? "pb-4" : ""
        }`}
      >
        <Link href="/products">
          <div className="cursor-pointer hover:text-secondary">
            {faLocalization.products}
          </div>
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/products?category=${cat.id}`}
            className="cursor-pointer text-sm hover:text-secondary"
            onMouseEnter={() => handleCategoryMouseEnter(cat.id)}
            onClick={() => {
              handleCategoryClick(cat.id);
            }}
          >
            {cat.title} {">"}
          </Link>
        ))}
        <Link href="/blogs">
          <div className="cursor-pointer hover:text-secondary">
            {faLocalization.blogs}
          </div>
        </Link>
      </div>

      {hoveredCategoryId !== null && (
        <div
          className="absolute left-0 top-full mt-1 w-full z-50"
          onMouseLeave={handleCategoryMouseLeave}
        >
          <div className="bg-white shadow-xl">
            <div className="max-w-screen-xl mx-auto px-4 py-4">
              {loading ? (
                <p className="text-gray-500">{faLocalization.loading}</p>
              ) : drugs.length > 0 ? (
                <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {drugs.map((drug) => (
                    <li key={drug.id} className="hover:bg-light p-2 rounded-md">
                      <Link href={`/singleProduct/${drug.id}`}>
                        <span className="block cursor-pointer hover:text-secondary">
                          {drug.productName}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">
                  {faLocalization.noDrugInCategory}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
