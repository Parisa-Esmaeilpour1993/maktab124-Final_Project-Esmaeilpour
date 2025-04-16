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
}

export interface ProductsState {
  products: ProductsProps[];
  loading: boolean;
  error: string | null;
}

export type NewProductProps = Omit<ProductsProps, "id">;
