"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";

const PaymentResult = () => {
  const params = useSearchParams();
  const router = useRouter();
  const status = params.get("status");

  useEffect(() => {
    const timer = setTimeout(() => {
      if (status === "success") {
        router.push("/orders");
      } else {
        router.push("/");
      }
    }, 4000);
    return () => clearTimeout(timer);
  }, [router, status]);

  return (
    <div className="flex items-center justify-center py-40 border-t border-secondary mx-4">
      <div className="text-center space-y-4">
        {status === "success" ? (
          <>
            <h2 className="text-green-600 text-2xl font-bold">
              پرداخت با موفقیت انجام شد
            </h2>
            <p className="text-gray-600">در حال انتقال به صفحه سفارشات...</p>
          </>
        ) : (
          <>
            <h2 className="text-red-600 text-2xl font-bold">
              پرداخت ناموفق بود
            </h2>
            <p className="text-gray-600">در حال بازگشت به صفحه اصلی...</p>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentResult;
