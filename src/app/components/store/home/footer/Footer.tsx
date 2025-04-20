import { faLocalization } from "@/app/constants/localization/fa/localization";
import Tooltip from "./Tooltip";
import Button from "./SocialButtons";

export default function Footer() {
  return (
    <footer className="bg-secondary text-light pt-10 px-6 md:px-16 lg:px-24">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 border-b border-gray-500 pb-10">
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl font-bold text-red-800">
            {faLocalization.logo}
          </h1>
          <p className="text-sm leading-6 text-light">
            ما در داروخانه آنلاین تلاش می‌کنیم تا با ارائه خدمات سریع و امن،
            داروها و مکمل‌های موردنیاز شما را در کمترین زمان به دستتان برسانیم.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2 text-primary">
            با داروفارم
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="/about" className="hover:text-primary transition">
                درباره ما
              </a>
            </li>
            <li>
              <a href="/contact" className="hover:text-primary transition">
                تماس با ما
              </a>
            </li>
            <li>
              <a href="/privacy" className="hover:text-primary transition">
                قوانین و مقررات
              </a>
            </li>
            <li>
              <a
                href="/shoppingGuide"
                className="hover:text-primary transition"
              >
                راهنمای خرید
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2 text-primary">
            خدمات مشتریان
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="/privacy" className="hover:text-primary transition">
                پروفایل کاربری
              </a>
            </li>
            <li>
              <a href="/contact" className="hover:text-primary transition">
                ورود کاربران
              </a>
            </li>
            <li>
              <a href="/about" className="hover:text-primary transition">
                ثبت نام
              </a>
            </li>
          </ul>
        </div>

        <div className="grid grid-cols-2 justify-between">
          <div>
            <div className="flex justify-between items-end mb-4">
              <h3 className="text-lg font-semibold text-primary">
                عضویت در خبرنامه
              </h3>
              <div className="animate-bounce">
                <Tooltip />
              </div>
            </div>
            <p className="text-sm my-3 text-light">
              برای دریافت تخفیف‌ها و اطلاع از محصولات جدید، ایمیل خود را وارد
              کنید.
            </p>
            <div className="flex items-center bg-white rounded-full overflow-hidden">
              <input
                type="email"
                placeholder="ایمیل شما"
                className="px-4 py-2 w-full text-black outline-none text-sm"
              />
              <button className="bg-primary text-white px-4 py-2 text-sm hover:bg-accent transition">
                عضویت
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-semibold text-primary">
              همراه ما باشید!
            </h3>
            <Button />
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center mt-6 py-4 text-sm text-light gap-4">
        <p>
          © {new Date().getFullYear()} داروخانه آنلاین. تمامی حقوق محفوظ است.
        </p>
      </div>
    </footer>
  );
}
