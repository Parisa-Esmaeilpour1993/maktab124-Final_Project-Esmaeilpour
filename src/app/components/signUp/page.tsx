"use client";
import signUpPage from "@/app/assets/images/signUpPage.jpg";
import { API_KEY, BASE_url } from "@/app/constants/api/BASE_URL";
import { signUpLocalization } from "@/app/constants/localization/fa/localization";
import ValidateInput from "@/app/utils/ValidateInput";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { IoEyeOffSharp } from "react-icons/io5";
import { MdRemoveRedEye } from "react-icons/md";
import { toast } from "react-toastify";

const SignUp = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const isFormValid = formData.name && formData.email && formData.password;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({ name: "", email: "", password: "" });

    const validationErrors = ValidateInput(
      formData.name,
      formData.email,
      formData.password
    );

    if (validationErrors) {
      setErrors(validationErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await axios.post(
        `${BASE_url}/api/users/register`,
        { ...formData },
        {
          headers: {
            api_key: API_KEY,
            Authorization: `Bearer {eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZDJlM2FiNzFiNTU0NTgwNmVkMWJlYyIsImlhdCI6MTc0MTg3NDEyNCwiZXhwIjoxNzQyMDQ2OTI0fQ.m8NyyLyGVYYni15jiCOuC86EAdIoZ03dlAvdqXC8hQk}`,
          },
        }
      );

      console.log("Signup successful:", response.data);
      router.push("/login");
    } catch (err: any) {
      console.error("Signup error:", err);
      toast.error(err.response?.data?.message || signUpLocalization.tryAgain);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFocus = () => {
    setErrors({ name: "", email: "", password: "" });
  };

  return (
    <div className="flex items-center justify-center">
      <div className="bg-indigo-50 p-8 rounded-2xl shadow-md my-4 w-full max-w-md md:max-w-2xl flex flex-col md:flex-row ">
        <div className="flex-1  flex flex-col gap-4">
          <h1 className="text-xl font-bold text-gray-800">
            {signUpLocalization.Signup}
          </h1>
          <p className="text-gray-600 text-sm">
            {signUpLocalization.AlreadyHaveAccount}{" "}
            <a
              href="/login"
              className="text-blue-900 underline hover:text-blue-950 active:scale-95"
            >
              {signUpLocalization.Login}
            </a>
          </p>

          <form
            onSubmit={handleSubmit}
            noValidate
            className="flex flex-col gap-4"
          >
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-2"
                htmlFor="name"
              >
                {signUpLocalization.Name}
              </label>
              <input
                type="text"
                id="name"
                placeholder={signUpLocalization.EnterName}
                value={formData.name}
                onFocus={handleFocus}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name}</p>
              )}
            </div>

            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-2"
                htmlFor="email"
              >
                {signUpLocalization.Email}
              </label>
              <input
                type="email"
                id="email"
                placeholder={signUpLocalization.EnterEmail}
                value={formData.email}
                onChange={handleChange}
                onFocus={handleFocus}
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}
            </div>

            <div className=" relative">
              <label
                className="block text-sm font-medium text-gray-700 mb-2"
                htmlFor="password"
              >
                {signUpLocalization.Password}
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={formData.password}
                onChange={handleChange}
                onFocus={handleFocus}
                placeholder={signUpLocalization.EnterPassword}
                className="w-full px-4 py-2 text-sm border bg-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 "
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute left-3 top-10 text-gray-500 hover:text-gray-700"
                tabIndex={-1}
              >
                {showPassword ? <MdRemoveRedEye /> : <IoEyeOffSharp />}
              </button>
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password}</p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="updates"
                className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-0"
              />
              <label htmlFor="updates" className="ml-2 text-sm text-gray-600">
                {signUpLocalization.signUpDescription}
              </label>
            </div>

            <button
              type="submit"
              className={`w-full py-2 rounded-lg transition duration-200 ${
                isFormValid && !isSubmitting
                  ? "bg-blue-900 text-white hover:bg-blue-600"
                  : "bg-blue-300 text-white cursor-not-allowed"
              }`}
              disabled={!isFormValid || isSubmitting}
            >
              {isSubmitting
                ? signUpLocalization.confirming
                : signUpLocalization.confirm}
            </button>
          </form>
        </div>

        <div className="flex-1 flex items-center justify-center mt-8 md:mt-0">
          <Image src={signUpPage} alt="loginPage" className="w-4/5 max-w-sm" />
        </div>
      </div>
    </div>
  );
};

export default SignUp;
