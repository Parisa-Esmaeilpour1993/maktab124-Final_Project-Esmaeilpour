import {
  faLocalization,
  FooterLocalization,
  pageLocalization,
} from "@/app/constants/localization/fa/localization";
import Tooltip from "./Tooltip";
import Button from "./SocialButtons";
import NewsletterForm from "./EmailSubscribe";
import { ToastContainer } from "react-toastify";

export default function Footer() {
  return (
    <div>
      <footer className="bg-secondary text-light pt-10 px-6 md:px-16 lg:px-24">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 border-b border-gray-500 pb-6">
          <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-bold text-red-800">
              {faLocalization.logo}
            </h1>
            <p className="text-sm leading-6 text-light">
              {FooterLocalization.description}
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2 text-primary">
              {FooterLocalization.withDaroopharm}
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/aboutUs" className="hover:text-primary transition">
                  {pageLocalization.aboutUs}
                </a>
              </li>
              <li>
                <a href="/contactUs" className="hover:text-primary transition">
                  {pageLocalization.contactUs}
                </a>
              </li>
              <li>
                <a href="/privacy" className="hover:text-primary transition">
                  {pageLocalization.privacy}
                </a>
              </li>
              <li>
                <a
                  href="/shoppingGuide"
                  className="hover:text-primary transition"
                >
                  {pageLocalization.guide}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2 text-primary">
              {FooterLocalization.customerServices}
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/" className="hover:text-primary transition">
                  {FooterLocalization.profile}
                </a>
              </li>
              <li>
                <a href="/login" className="hover:text-primary transition">
                  {FooterLocalization.login}
                </a>
              </li>
              <li>
                <a href="/signUp" className="hover:text-primary transition">
                  {FooterLocalization.signUp}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <div className="flex flex-col gap-6 justify-between lg:flex-row items-center mb-5">
              <h3 className="text-lg font-semibold text-primary">
                {FooterLocalization.memberShip}
              </h3>
              <div className="animate-bounce">
                <Tooltip />
              </div>
            </div>
            <p className="text-sm my-4 text-light">
              {FooterLocalization.sendEmailForNews}
            </p>
            <NewsletterForm />
          </div>
          <div className="flex flex-col items-center md:items-start gap-4">
            <h3 className="text-lg font-semibold text-primary">
              {FooterLocalization.withUs}
            </h3>
            <Button />
          </div>
        </div>

        <p className="text-center py-4">
          {new Date().getFullYear()} © {FooterLocalization.copyRight}
        </p>
      </footer>
      <ToastContainer />
    </div>
  );
}
