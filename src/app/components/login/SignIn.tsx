"use client";

import loginPage from "@/app/assets/images/login.jpg";
import { API_KEY, BASE_url } from "@/app/constants/api/BASE_URL";
import { loginLocalization } from "@/app/constants/localization/fa/localization";
import Button from "@/app/shared/Button";
import { Input } from "@/app/shared/Input";
import { adminEmails } from "@/app/utils/adminsEmail";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { IoEyeOffSharp } from "react-icons/io5";
import { MdRemoveRedEye } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError(loginLocalization.allFieldsRequired);
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${BASE_url}/api/users/login`,
        { email, password },
        { headers: { api_key: API_KEY } }
      );

      const { accessToken } = response.data;

      localStorage.setItem("authToken", accessToken);
      localStorage.setItem("loginTime", Date.now().toString());

      const admin = adminEmails.find((admin) => admin.email === email);
      if (admin) {
        localStorage.setItem("username", admin.username);
        localStorage.setItem("email", email);
        toast.success(loginLocalization.successLogin);
        router.push("/admin");
      } else {
        localStorage.setItem("email", email);
        toast.success(loginLocalization.successLogin);
        router.push("/");
      }

      window.dispatchEvent(new Event("authChange"));
    } catch (error) {
      setError(loginLocalization.loginError);
      toast.error(loginLocalization.toastError);
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFocus = () => {
    setError("");
  };

  return (
    <div className="flex items-center justify-center">
      <ToastContainer />
      <div className="bg-light p-4 rounded-2xl shadow-xl w-full max-w-md md:max-w-2xl flex flex-col md:flex-row my-4">
        <div className="flex-1 flex flex-col gap-4">
          <h1 className="text-xl font-bold text-primary">
            {loginLocalization.Login}
          </h1>
          <p className="text-secondary hover:text-primary text-sm">
            {loginLocalization.DontHaveAccount}{" "}
            <Button
              onClick={() => router.push("/signUp")}
              children={loginLocalization.SignupHere}
              className="!py-1 !px-2 "
            />
          </p>

          <form
            onSubmit={handleLogin}
            noValidate
            className="flex flex-col gap-4"
          >
            <div>
              <label
                className="block text-sm font-medium text-primary mb-2"
                htmlFor="email"
              >
                {loginLocalization.Email}
              </label>

              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={handleFocus}
                placeholder={loginLocalization.EnterEmail}
                className="text-sm"
              />
            </div>

            <div className="relative">
              <label
                className="block text-sm font-medium text-primary mb-2"
                htmlFor="password"
              >
                {loginLocalization.Password}
              </label>
              <Input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={handleFocus}
                placeholder={loginLocalization.EnterPassword}
                className="text-sm"
              />
              <Button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute !bg-white left-[2px] top-8"
                tabIndex={-1}
              >
                {showPassword ? (
                  <MdRemoveRedEye className="text-secondary" />
                ) : (
                  <IoEyeOffSharp className="text-secondary" />
                )}
              </Button>
            </div>

            {error && <div className="text-red-600 text-sm">{error}</div>}

            <div className="flex items-center justify-between">
              <div className="flex gap-1 items-center">
                <input
                  type="checkbox"
                  id="remember"
                  className="w-4 h-4 accent-primary text-primary border-secondary rounded focus:ring-0"
                />
                <label
                  htmlFor="remember"
                  className="ml-2 text-sm text-secondary"
                >
                  {loginLocalization.RememberMe}
                </label>
              </div>
              <Link
                href="#"
                className="text-sm text-secondary hover:text-primary underline"
              >
                {loginLocalization.ForgotPassword}
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center items-center gap-2 bg-secondary text-white py-2 rounded-lg hover:bg-primary active:scale-95 transition duration-200 ${
                isLoading ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                loginLocalization.Login
              )}
            </button>
          </form>
        </div>

        <div className="flex-1 flex items-center justify-center mt-8 md:mt-0">
          <Image src={loginPage} alt="loginPage" className="w-4/5 max-w-sm" />
        </div>
      </div>
    </div>
  );
};

export default Login;
