import axios from "axios";
import { API_KEY, BASE_url } from "@/app/constants/api/BASE_URL";
import { ProductsProps } from "@/app/types/products";
import { productsLocalization } from "@/app/constants/localization/fa/localization";
import { notFound } from "next/navigation";
import ExpandableBox from "@/app/components/store/singleProduct/ExpandableBox";
import { GiHealthPotion } from "react-icons/gi";
import { TbTruckDelivery } from "react-icons/tb";
import { MdOutlineLocalPharmacy } from "react-icons/md";
import { FaUserDoctor } from "react-icons/fa6";
import FavoriteButton from "@/app/components/store/products/FavoriteButton";
import AddToCartButton from "@/app/components/store/singleProduct/AddToCartButton";

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
      (off: any) => off.productName === product.productName
    );

    const discountPercent = matchedOffProduct?.discountPercent || 0;
    const price = +product.productPrice;
    const discountAmount = Math.floor((price * discountPercent) / 100);
    const finalPrice = price - discountAmount;

    const quantity = +product.productQuantity;
    const isOutOfStock = quantity === 0;

    return (
      <div className=" flex flex-col-reverse md:grid md:grid-cols-4 border-t border-secondary mx-4 px-4 py-8 gap-6 relative">
        {/* Right: Sticky Summary Box */}
        <div className=" col-span-2 lg:col-span-1">
          <div className="sticky top-20 bg-white border border-gray-200 shadow-md rounded-2xl p-6 space-y-6">
            <div className="flex justify-center items-center gap-2">
              <TbTruckDelivery size={24} className="text-primary" />
              <GiHealthPotion size={24} className="text-primary" />
              <MdOutlineLocalPharmacy size={24} className="text-primary" />
              <FaUserDoctor size={24} className="text-primary" />
            </div>

            <div>
              <div className="text-sm border-b pb-2">
                <h2 className="font-semibold mb-1">تضمین کیفیت</h2>
                <p>بررسی و کنترل نهایی توسط دکتر داروساز</p>
              </div>
              <div className="text-sm border-b py-2">
                <h2 className="font-semibold mb-1">اصالت کالا</h2>
                <p>دارای مجوز رسمی از سازمان غذا و دارو</p>
              </div>
              <div className="text-sm border-b py-2">
                <h2 className="font-semibold mb-1">ارسال رایگان</h2>
                <p>ارسال رایگان سفارشات بالای 800 هزار تومان</p>
              </div>
              <div className="text-sm border-b py-2">
                <p>هزینه ارسال به سراسر کشور 40 هزار تومان</p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <span className="font-semibold">قیمت مصرف کننده:</span>
              <div className="text-xl font-bold text-secondary text-center">
                {discountPercent > 0 ? (
                  <div className="space-y-2">
                    <div className="flex flex-col xl:flex-row items-center justify-center gap-2">
                      <span className="text-base line-through text-gray-500">
                        {price.toLocaleString()} تومان
                      </span>
                      <span className="bg-red-500 my-2 xl:my-0 text-white text-sm px-2 py-1 rounded-full">
                        {discountPercent}% تخفیف
                      </span>
                    </div>
                    <span className=" text-xl xl:text-2xl block">
                      {finalPrice.toLocaleString()} تومان
                    </span>
                  </div>
                ) : (
                  <span className="text-2xl">
                    {price.toLocaleString()} تومان
                  </span>
                )}
              </div>
            </div>

            <div className="text-sm text-center text-gray-600">
              {isOutOfStock ? (
                <p className="text-red-600 text- font-semibold text-xl">
                  ناموجود
                </p>
              ) : (
                quantity < 5 && (
                  <p className="text-red-600">
                    فقط {quantity} عدد در انبار موجود است
                  </p>
                )
              )}
            </div>

            {isOutOfStock ? (
              <button
                className="w-full py-3 bg-primary rounded-xl font-semibold cursor-pointer"
                disabled
              >
                اگر موجود شد، خبر بده
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
            <img
              src={`${BASE_url}${product.image}`}
              alt={product.productName}
              className="rounded-xl w-full h-96 object-contain bg-white"
            />
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
                  {product.productExpired || "—"}
                </p>
              </div>
              {discountPercent !== 0 && (
                <span className="text-center animate-pulseGlow text-amber-600 px-2 py-1 rounded-full">
                  {discountPercent}% تخفیف
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
                مشخصات
              </div>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 text-sm border p-4 rounded">
                <div className="flex justify-between mx-3 px-3 border-b pb-1">
                  <span className="font-semibold">
                    {productsLocalization.productType}
                  </span>
                  <span>{product.productType}</span>
                </div>
                <div className="flex justify-between mx-3 px-3 border-b pb-1">
                  <span className="font-semibold">
                    {productsLocalization.number}
                  </span>
                  <span>{product.productNumber}</span>
                </div>
                <div className="flex justify-between mx-3 px-3 border-b pb-1">
                  <span className="font-semibold">
                    {productsLocalization.process}
                  </span>
                  <span>{product.productProcess}</span>
                </div>
                <div className="flex justify-between mx-3 px-3 border-b pb-1">
                  <span className="font-semibold">
                    {productsLocalization.capsule}
                  </span>
                  <span>{product.productCapsule}</span>
                </div>
                <div className="flex justify-between mx-3 px-3 border-b pb-1">
                  <span className="font-semibold">
                    {productsLocalization.age}
                  </span>
                  <span>{product.productAge}</span>
                </div>
                <div className="flex justify-between mx-3 px-3 border-b pb-1">
                  <span className="font-semibold">
                    {productsLocalization.country}
                  </span>
                  <span>{product.productCountry}</span>
                </div>
                <div className="flex justify-between mx-3 px-3 pb-1">
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
    );
  } catch (error) {
    console.error("Failed to fetch product:", error);
    return notFound();
  }
}
