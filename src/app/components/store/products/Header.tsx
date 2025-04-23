import { HeaderSortProps } from "@/app/types/products";

const sortOptions = [
  { label: "جدیدترین", value: "newest" },
  { label: "قدیمی‌ترین", value: "oldest" },
  { label: "حروف الفبا", value: "alphabetical" },
  { label: "گران‌ترین", value: "expensive" },
  { label: "ارزان‌ترین", value: "cheap" },
];

export default function Header({ sort, setSort }: HeaderSortProps) {
  return (
    <div className="flex flex-wrap mb-6 gap-2 border-b pb-4">
      {sortOptions.map((option) => (
        <button
          key={option.value}
          onClick={() => setSort(option.value)}
          className={`px-4 py-2 rounded-lg shadow-accent transition ${
            sort === option.value
              ? "bg-secondary text-white "
              : "bg-white text-gray-700  hover:bg-gray-100"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
