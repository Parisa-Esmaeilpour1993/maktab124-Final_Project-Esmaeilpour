import FavoriteButton from "@/app/components/store/products/FavoriteButton";
import AddToCartButton from "@/app/components/store/singleProduct/AddToCartButton";
import DescriptionSide from "@/app/components/store/singleProduct/DescriptionSide";
import ExpandableBox from "@/app/components/store/singleProduct/ExpandableBox";
import ProductImageZoom from "@/app/components/store/singleProduct/Magnifire";
import RelatedProducts from "@/app/components/store/singleProduct/RelatedProducts";
import { API_KEY, BASE_url } from "@/app/constants/api/BASE_URL";
import {
  faLocalization,
  productsLocalization,
} from "@/app/constants/localization/fa/localization";
import { ProductsProps, SingleProductPageProps } from "@/app/types/products";
import axios from "axios";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: SingleProductPageProps): Promise<Metadata> {
  try {
    const res = await axios.get(`${BASE_url}/api/records/drugs/${params.id}`, {
      headers: { api_key: API_KEY },
    });

    const product: ProductsProps = res.data;

    return {
      title: `${product.productName} | داروفارم`,
      description:
        product.productDescription?.slice(0, 160) ||
        "مشاهده مشخصات محصول در داروفارم.",
      keywords: [product.productName, product.productCompany],
      openGraph: {
        title: product.productName,
        description: product.productDescription?.slice(0, 160),
        images: product.image ? [`${BASE_url}${product.image}`] : [],
      },
    };
  } catch (error) {
    return {
      title: "محصول یافت نشد | فروشگاه",
      description: "این محصول ممکن است حذف شده یا در دسترس نباشد.",
    };
  }
}

export default async function SingleProductPage({
  params,
}: {
  params: { id: string };
}) {
  try {
    const productResponse = await axios.get(
      `${BASE_url}/api/records/drugs/${params.id}`,
      { headers: { api_key: API_KEY } }
    );
    const product: ProductsProps = productResponse.data;

    const offResponse = await axios.get(`${BASE_url}/api/records/offProducts`, {
      headers: { api_key: API_KEY },
    });

    const offProducts = offResponse.data?.records || [];

    const matchedOffProduct = offProducts.find(
      (off: ProductsProps) => off.productName === product.productName
    );

    const discountPercent = matchedOffProduct?.discountPercent || 0;
    const price = +product.productPrice;
    const discountAmount = Math.floor((price * discountPercent) / 100);
    const finalPrice = price - discountAmount;

    const quantity = +product.productQuantity;
    const isOutOfStock = quantity === 0;

    const relatedProductsResponse = await axios.get(
      `${BASE_url}/api/records/drugs`,
      {
        headers: { api_key: API_KEY },
      }
    );
    const relatedProducts = relatedProductsResponse.data.records.filter(
      (item: ProductsProps) =>
        item.productCategory === product.productCategory &&
        item.id !== product.id
    );

    return (
      <div>
        <div className=" flex flex-col-reverse md:grid md:grid-cols-4 border-t border-secondary mx-4 px-4 py-8 gap-6 relative">
          {/* Right: Sticky Summary Box */}
          <div className=" col-span-2 lg:col-span-1">
            <div className="sticky top-20 bg-white border border-gray-200 shadow-md rounded-2xl p-6 space-y-6">
              <DescriptionSide />
              <div className="flex flex-col gap-2">
                <span className="font-semibold">
                  {productsLocalization.consumerPrice}
                </span>
                <div className="text-xl font-bold text-secondary text-center">
                  {discountPercent > 0 ? (
                    <div className="space-y-2">
                      <div className="flex flex-col xl:flex-row items-center justify-center gap-2">
                        <span className="text-base line-through text-gray-500">
                          {price.toLocaleString()} {faLocalization.rial}
                        </span>
                        <span className="bg-red-500 my-2 xl:my-0 text-white text-sm px-2 py-1 rounded-full">
                          {discountPercent}% {productsLocalization.discount}
                        </span>
                      </div>
                      <span className=" text-xl xl:text-2xl block">
                        {finalPrice.toLocaleString()} {faLocalization.rial}
                      </span>
                    </div>
                  ) : (
                    <span className="text-2xl">
                      {price.toLocaleString()} {faLocalization.rial}
                    </span>
                  )}
                </div>
              </div>

              <div className="text-sm text-center text-gray-600">
                {isOutOfStock ? (
                  <p className="text-red-600 text- font-semibold text-xl">
                    {productsLocalization.unavailable}
                  </p>
                ) : (
                  quantity < 5 && (
                    <p className="text-red-600">
                      {productsLocalization.just} {quantity}{" "}
                      {productsLocalization.availableInStore}
                    </p>
                  )
                )}
              </div>

              {isOutOfStock ? (
                <button
                  className="w-full py-3 bg-primary rounded-xl font-semibold cursor-pointer"
                  disabled
                >
                  {productsLocalization.announce}
                </button>
              ) : (
                <AddToCartButton productId={product.id} />
              )}
            </div>
          </div>

          {/* Left: Product Description and Image */}
          <div
            className={`col-span-2 lg:col-span-3 grid lg:grid-cols-3 space-y-8 bg-white border border-gray-200 shadow-md rounded-2xl p-6 ${
              isOutOfStock ? "pointer-events-none select-none opacity-60" : ""
            }`}
          >
            <div className="relative hidden lg:block lg:col-span-1 p-4">
              <ProductImageZoom imageUrl={`${BASE_url}${product.image}`} />
              <FavoriteButton productId={product.id} />
            </div>

            <div className="col-span-2 flex flex-col gap-6">
              <div className="flex justify-between lg:gap-4 items-center">
                <div className="flex flex-col gap-2">
                  <h1 className=" text-xl lg:text-2xl font-semibold lg:font-bold">
                    {product.productName}
                  </h1>
                  <div className="relative block lg:hidden p-4">
                    <img
                      src={`${BASE_url}${product.image}`}
                      alt={product.productName}
                      className="rounded-xl w-full h-80 lg:h-96 object-contain bg-white"
                    />
                    <FavoriteButton productId={product.id} />
                  </div>
                  <p className="text-gray-700">
                    <strong>{productsLocalization.expireDate}:</strong>{" "}
                    <span dir="ltr">{product.productExpired}</span>
                  </p>
                </div>
                {discountPercent !== 0 && (
                  <span className="text-center animate-pulseGlow text-amber-600 px-2 py-1 rounded-full">
                    {discountPercent}% {productsLocalization.discount}
                  </span>
                )}
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-2">
                  {productsLocalization.description}
                </h2>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {product.productDescription || "—"}
                </p>
              </div>

              <div className="text-sm border rounded-md shadow p-2">
                <div className="bg-accent mb-2 text-center font-semibold py-1">
                  {productsLocalization.specification}
                </div>
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 text-sm border py-4 px-2 lg:px-3 rounded">
                  <div className="flex justify-between mx-2 px-1 border-b pb-1">
                    <span className="font-semibold">
                      {productsLocalization.productType}
                    </span>
                    <span>{product.productType}</span>
                  </div>
                  <div className="flex justify-between mx-2 px-1 border-b pb-1">
                    <span className="font-semibold">
                      {productsLocalization.number}
                    </span>
                    <span>{product.productNumber}</span>
                  </div>
                  <div className="flex justify-between mx-2 px-1 border-b pb-1">
                    <span className="font-semibold">
                      {productsLocalization.process}
                    </span>
                    <span>{product.productProcess}</span>
                  </div>
                  <div className="flex justify-between mx-2 px-1 border-b pb-1">
                    <span className="font-semibold">
                      {productsLocalization.capsule}
                    </span>
                    <span>{product.productCapsule}</span>
                  </div>
                  <div className="flex justify-between mx-2 px-1 border-b pb-1">
                    <span className="font-semibold">
                      {productsLocalization.age}
                    </span>
                    <span>
                      {faLocalization.from} {product.productAge}{" "}
                      {faLocalization.year}
                    </span>
                  </div>
                  <div className="flex justify-between mx-2 px-1 border-b pb-1">
                    <span className="font-semibold">
                      {productsLocalization.country}
                    </span>
                    <span>{product.productCountry}</span>
                  </div>
                  <div className="flex justify-between mx-2 px-1 pb-1">
                    <span className="font-semibold">
                      {productsLocalization.company}
                    </span>
                    <span>{product.productCompany}</span>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">
                  {productsLocalization.information}
                </h2>
                <ExpandableBox>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {product.productSpecifications}
                  </p>
                </ExpandableBox>
              </div>
            </div>
          </div>
        </div>
        <RelatedProducts products={relatedProducts} />
      </div>
    );
  } catch (error) {
    console.error("Failed to fetch product:", error);
    return notFound();
  }
}
