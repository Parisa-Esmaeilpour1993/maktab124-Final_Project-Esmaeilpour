import { SingleProductPageProps } from "@/app/types/products";
import React from "react";

function singleProductPage({ params }: SingleProductPageProps) {
  return <div>Product Detail: {params.id}</div>;
}

export default singleProductPage;
