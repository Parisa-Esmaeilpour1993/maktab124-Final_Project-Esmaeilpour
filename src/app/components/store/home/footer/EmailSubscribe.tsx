"use client";
import { getAuthToken } from "@/app/base/getAuthToken";
import { API_KEY, BASE_url } from "@/app/constants/api/BASE_URL";
import {
  FooterLocalization,
  loginLocalization,
  signUpLocalization,
  validateLocalization,
} from "@/app/constants/localization/fa/localization";
import { NewsletterItem } from "@/app/types/newsLetterForm";
import axios from "axios";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const token = getAuthToken();

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubscribe = async () => {
    if (!email) return toast.warning(loginLocalization.EnterEmail);

    if (!isValidEmail(email)) {
      return toast.error(validateLocalization.emailRegex);
    }

    try {
      const existingRes = await axios.get(
        `${BASE_url}/api/records/newsletter`,
        {
          headers: {
            api_key: API_KEY,
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const existingEmails = existingRes?.data.records as NewsletterItem[];

      const isDuplicate = existingEmails.some(
        (item) => item.email?.toLowerCase() === email.toLowerCase()
      );

      if (isDuplicate) {
        return toast.warning(signUpLocalization.tryAgain);
      }

      const res = await axios.post(
        `${BASE_url}/api/records/newsletter`,
        { email },
        {
          headers: {
            api_key: API_KEY,
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 201) {
        toast.success(FooterLocalization.successEmail);
        setEmail("");
      }
    } catch (err) {
      toast.error(FooterLocalization.errorInEmail);
    }
  };

  return (
    <div>
      <div className="flex items-center bg-white rounded-full overflow-hidden">
        <input
          type="email"
          placeholder={FooterLocalization.emailPlaceholder}
          className="px-4 py-2 w-full text-black outline-none text-sm"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          className="bg-primary text-white px-2 py-2 text-sm hover:bg-accent transition"
          onClick={handleSubscribe}
        >
          {FooterLocalization.memberShipButton}
        </button>
      </div>
      <ToastContainer position="top-center" />
    </div>
  );
}
