import { Category } from "./category";

export interface SingleProductPageProps {
  params: {
    id: string;
  };
}
export interface ProductsProps {
  id: string;
  productName: string;
  productCategory: string;
  productPrice: number | "";
  productQuantity: number | "";
  productDescription: string;
  productSpecifications: string;
  productExpired: string;
  image: string;
  discountPercent?: number;
  createdAt: string;
}

export interface ProductsState {
  products: ProductsProps[];
  loading: boolean;
  error: string | null;
}

export type NewProductProps = Omit<ProductsProps, "id">;

export interface ProductsFilterProps {
  filterCategory: string;
  filterStock: string;
  sortOption: string;
  setFilterCategory: React.Dispatch<React.SetStateAction<string>>;
  setFilterStock: React.Dispatch<React.SetStateAction<string>>;
  setSortOption: React.Dispatch<React.SetStateAction<string>>;
  category: Category[];
}

export interface ProductTableProps {
  products: ProductsProps[];
  category: Category[];
  handleDelete?: (id: string) => void;
  onEditClick?: (product: ProductsProps) => void;
  onDetailClick?: (product: ProductsProps) => void;
  onInlineEdit: (id: string, field: string, value: string) => void;
}

export interface HeaderSortProps {
  sort: string;
  setSort: (value: string) => void;
}

export interface Filters {
  availableOnly: boolean;
  discountOnly: boolean;
  categories: string[];
}

export interface SidebarProps {
  filter: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
}

export interface Discount {
  id: string;
  productName: string;
  discountPercent: number;
}

export interface IProducts {
  products: ProductsProps[];
  discountedProducts?: {
    id: string;
    discountPercent: number;
    productName: string;
  }[];
  favoriteProductIds: string[];
}
