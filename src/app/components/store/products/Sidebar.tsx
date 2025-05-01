import {
  faLocalization,
  productsLocalization,
} from "@/app/constants/localization/fa/localization";
import { useAppDispatch } from "@/app/redux/store/hooks";
import { fetchCategories } from "@/app/services/fetchCategory";
import { Category } from "@/app/types/category";
import { SidebarProps } from "@/app/types/products";
import { useEffect, useState } from "react";
import ReactSlider from "react-slider";

export default function Sidebar({ filter, setFilters }: SidebarProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([
    0, 100000000,
  ]);
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchCategories())
      .unwrap()
      .then((res) => {
        setCategories(res);
      });
  }, []);

  useEffect(() => {}, [categories]);

  useEffect(() => {
    setFilters((f) => ({
      ...f,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
    }));
  }, [priceRange]);

  return (
    <aside className=" w-[150px] md:w-64 py-4 pr-1 md:p-4 shadow text-[15px]">
      <h3 className=" font-bold mb-2">{productsLocalization.filters}</h3>
      <div className="flex flex-col gap-2">
        <label className="flex items-center gap-1">
          <input
            type="checkbox"
            onChange={(e) =>
              setFilters((f) => ({ ...f, availableOnly: e.target.checked }))
            }
            className="accent-secondary"
          />
          <p className=" text-[13px] md:text-[16px]">
            {productsLocalization.justAvailable}
          </p>
        </label>
        <label className="flex items-center gap-1">
          <input
            type="checkbox"
            onChange={(e) =>
              setFilters((f) => ({ ...f, discountOnly: e.target.checked }))
            }
            className="accent-secondary"
          />
          <p className=" text-[13px] md:text-[16px]">
            {productsLocalization.justOffer}
          </p>
        </label>
      </div>
      <div className="mt-4">
        <h4 className="font-semibold mb-2">
          {productsLocalization.categories}
        </h4>
        {categories.map((cat) => (
          <div key={cat.id}>
            <label className="flex items-center gap-1 mb-1">
              <input
                type="checkbox"
                checked={filter.categories.includes(cat.id)}
                onChange={(e) =>
                  setFilters((f) => ({
                    ...f,
                    categories: e.target.checked
                      ? [...f.categories, cat.id]
                      : f.categories.filter((id) => id !== cat.id),
                  }))
                }
                className="accent-secondary"
              />
              <p className=" text-sm md:text-[16px]">{cat.title}</p>
            </label>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <h4 className="font-semibold mb-3">
          {faLocalization.priceRange}({faLocalization.rial})
        </h4>
        <ReactSlider
          className="w-full h-2 bg-light rounded"
          thumbClassName="w-3 h-3 bg-secondary outline-none border-none rounded-full cursor-pointer -mt-[2px]"
          renderTrack={(
            props: React.HTMLAttributes<HTMLDivElement>,
            state: { index: number }
          ) => (
            <div
              {...props}
              className={`h-2 rounded ${
                state.index === 1 ? "bg-accent" : "bg-light"
              }`}
            />
          )}
          min={0}
          max={100000000}
          step={1000000}
          value={priceRange}
          onChange={(value: [number, number]) => {
            setPriceRange(value);
          }}
          pearling
          minDistance={1000000}
        />
        <div className="flex justify-between mt-3 text-xs">
          <span>{priceRange[1].toLocaleString()}</span>
          <span>{priceRange[0].toLocaleString()}</span>
        </div>
      </div>
    </aside>
  );
}
