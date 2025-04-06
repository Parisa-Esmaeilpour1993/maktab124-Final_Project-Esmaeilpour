export interface Category {
  id: string;
  title: string;
  children?: Category[];
}

export interface CategoryState {
  categories: Category[];
  loading: boolean;
  error: string | null;
}
