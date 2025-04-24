import { useEffect, useState } from "react";
import { fetchCategories } from "@/app/services/fetchCategory";
import { useAppDispatch } from "@/app/redux/store/hooks";
import { Category } from "@/app/types/category";
import { SidebarProps } from "@/app/types/products";

export default function Sidebar({ filter, setFilters }: SidebarProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchCategories())
      .unwrap()
      .then((res) => {
        setCategories(res);
      });
  }, []);

  useEffect(() => {}, [categories]);

  return (
    <aside className="w-64 p-4 shadow">
      <h3 className="text-lg font-bold mb-2">فیلترها</h3>
      <div className="flex flex-col gap-2 ">
        <label>
          <input
            type="checkbox"
            onChange={(e) =>
              setFilters((f) => ({ ...f, availableOnly: e.target.checked }))
            }
            className="accent-secondary"
          />
          فقط کالاهای موجود
        </label>
        <label>
          <input
            type="checkbox"
            onChange={(e) =>
              setFilters((f) => ({ ...f, discountOnly: e.target.checked }))
            }
            className="accent-secondary"
          />
          فقط کالاهای تخفیف‌دار
        </label>
      </div>
      <div className="mt-4">
        <h4 className="font-semibold">دسته‌بندی‌ها</h4>
        {categories.map((cat) => (
          <div key={cat.id}>
            <label>
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
              {cat.title}
            </label>
          </div>
        ))}
      </div>
    </aside>
  );
}
