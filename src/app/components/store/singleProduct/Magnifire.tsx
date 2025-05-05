"use client";

import React from "react";
import InnerImageZoom from "react-inner-image-zoom";
import "react-inner-image-zoom/lib/styles.min.css";

interface ProductImageZoomProps {
  imageUrl: string;
}

const ProductImageZoom: React.FC<ProductImageZoomProps> = ({ imageUrl }) => {
  return (
    <div className="relative mt-14">
      <InnerImageZoom
        src={imageUrl}
        zoomSrc={imageUrl}
        zoomType="hover"
        zoomScale={1.8}
        hideHint={true}
        className="rounded-xl bg-white w-full h-96 object-contain"
      />
    </div>
  );
};

export default ProductImageZoom;
