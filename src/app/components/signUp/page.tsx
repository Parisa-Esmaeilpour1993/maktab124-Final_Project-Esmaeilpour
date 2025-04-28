"use client";
import { getAuthToken } from "@/app/base/getAuthToken";
import { API_KEY, BASE_url } from "@/app/constants/api/BASE_URL";
import { signUpLocalization } from "@/app/constants/localization/fa/localization";
import Button from "@/app/shared/Button";
import { Input } from "@/app/shared/Input";
import ValidateInput from "@/app/utils/ValidateInput";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { IoEyeOffSharp } from "react-icons/io5";
import { MdRemoveRedEye } from "react-icons/md";
import { toast, ToastContainer } from "react-toastify";
import Card from "./uiverse";
import Buttons from "./SocialButtons";

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
  const [isLoading, setIsLoading] = useState(false);

  const isFormValid = formData.name && formData.email && formData.password;
  const token = getAuthToken();

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
      const res = await axios.post(
        `${BASE_url}/api/users/register`,
        { ...formData },
        {
          headers: {
            api_key: API_KEY,
            Authorization: `Bearer ${token}`,
          },
        }
      );

      router.push("/login");
    } catch (err: any) {
      console.error("Signup error:", err);
      toast.error(signUpLocalization.tryAgain || err.response?.data?.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFocus = () => {
    setErrors({ name: "", email: "", password: "" });
  };

  return (
    <div>
      <div className="flex items-center justify-center border-t-2 mx-4 py-2 border-secondary">
        <div className="bg-light px-4 py-6 rounded-2xl shadow-md my-3 w-5/6 lg:w-3/5 flex flex-col md:flex-row ">
          <div className="flex-1 flex flex-col gap-4 px-4">
            <h1 className="text-xl font-bold text-primary">
              {signUpLocalization.Signup}
            </h1>
            <p className="text-secondary hover:text-primary text-sm">
              {signUpLocalization.AlreadyHaveAccount}{" "}
              <Button
                onClick={() => {
                  setIsLoading(true);
                  router.push("/login");
                }}
                className="!py-1 !px-2 "
              >
                {isLoading ? (
                  <div className="flex justify-center items-center h-full w-full">
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : (
                  signUpLocalization.Login
                )}
              </Button>
            </p>

            <form
              onSubmit={handleSubmit}
              noValidate
              className="flex flex-col gap-4"
            >
              <div>
                <label
                  className="block text-sm font-medium text-primary mb-2"
                  htmlFor="name"
                >
                  {signUpLocalization.Name}
                </label>
                <Input
                  type="text"
                  id="name"
                  placeholder={signUpLocalization.EnterName}
                  value={formData.name}
                  onFocus={handleFocus}
                  onChange={handleChange}
                  className="text-sm"
                />
                {errors.name && (
                  <p className="text-red-600 text-sm">{errors.name}</p>
                )}
              </div>

              <div>
                <label
                  className="block text-sm font-medium text-primary mb-2"
                  htmlFor="email"
                >
                  {signUpLocalization.Email}
                </label>
                <Input
                  type="email"
                  id="email"
                  placeholder={signUpLocalization.EnterEmail}
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  className="text-sm"
                />
                {errors.email && (
                  <p className="text-red-600 text-sm">{errors.email}</p>
                )}
              </div>

              <div className=" relative">
                <label
                  className="block text-sm font-medium text-primary mb-2"
                  htmlFor="password"
                >
                  {signUpLocalization.Password}
                </label>
                <Input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  placeholder={signUpLocalization.EnterPassword}
                  className="text-sm"
                />
                <Button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute !bg-white left-[1px] top-8"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <MdRemoveRedEye className="text-secondary" />
                  ) : (
                    <IoEyeOffSharp className="text-secondary" />
                  )}
                </Button>
                {errors.password && (
                  <p className="text-red-600 text-sm">{errors.password}</p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="updates"
                  className="w-4 h-4 accent-primary text-primary border-secondary rounded focus:ring-0"
                />
                <label
                  htmlFor="updates"
                  className="ml-2 text-sm text-secondary"
                >
                  {signUpLocalization.signUpDescription}
                </label>
              </div>

              <button
                type="submit"
                className={`w-full py-2 rounded-lg transition duration-200 ${
                  isFormValid && !isSubmitting
                    ? "bg-primary text-white active:scale-95"
                    : "bg-accent text-white cursor-not-allowed"
                }`}
                disabled={!isFormValid || isSubmitting}
              >
                {isSubmitting
                  ? signUpLocalization.confirming
                  : signUpLocalization.confirm}
              </button>
            </form>
          </div>

          <div className="flex-1 flex flex-col items-center gap-8 justify-center mt-8 md:mt-0">
            <Card />
            <Buttons />
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default SignUp;
