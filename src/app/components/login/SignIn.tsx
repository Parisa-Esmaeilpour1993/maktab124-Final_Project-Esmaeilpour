"use client";

import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import loginPage from "@/app/assets/images/loginPage.jpg";
import { API_KEY, BASE_url } from "@/app/constants/api/BASE_URL";
import { loginLocalization } from "@/app/constants/localization/fa/localization";
import { ToastContainer, toast } from "react-toastify";
import { MdRemoveRedEye } from "react-icons/md";
import { IoEyeOffSharp } from "react-icons/io5";
import { adminEmails } from "@/app/utils/adminsEmail";

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError(loginLocalization.allFieldsRequired);
      return;
    }

    try {
      const response = await axios.post(
        `${BASE_url}/api/users/login`,
        { email, password },
        { headers: { api_key: API_KEY } }
      );
      console.log(response.data);

      const { accessToken } = response.data;

      localStorage.setItem("authToken", accessToken);

      const admin = adminEmails.find((admin) => admin.email === email);
      if (admin) {
        localStorage.setItem("username", admin.username);

        toast.success(loginLocalization.successLogin);
        router.push("/admin");
      } else {
        toast.success(loginLocalization.successLogin);
        router.push("/");
      }
    } catch (error) {
      setError(loginLocalization.loginError);
      toast.error(loginLocalization.toastError);
      console.error("Login error:", error);
    }
  };

  const handleFocus = () => {
    setError("");
  };

  return (
    <div className="flex items-center justify-center">
      <ToastContainer />
      <div className="bg-indigo-50 p-4 rounded-2xl shadow-xl w-full max-w-md md:max-w-2xl flex flex-col md:flex-row my-4">
        <div className="flex-1 flex flex-col gap-4">
          <h1 className="text-xl font-bold text-gray-800">
            {loginLocalization.Login}
          </h1>
          <p className="text-gray-600 text-sm">
            {loginLocalization.DontHaveAccount}{" "}
            <button
              onClick={() => router.push("/signUp")}
              className="text-blue-900 underline hover:text-blue-950 active:scale-95"
            >
              {loginLocalization.SignupHere}
            </button>
          </p>

          <form
            onSubmit={handleLogin}
            noValidate
            className="flex flex-col gap-4"
          >
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-2"
                htmlFor="email"
              >
                {loginLocalization.Email}
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={handleFocus}
                placeholder={loginLocalization.EnterEmail}
                className="w-full px-4 py-2 text-sm border bg-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div className="relative">
              <label
                className="block text-sm font-medium text-gray-700 mb-2"
                htmlFor="password"
              >
                {loginLocalization.Password}
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={handleFocus}
                placeholder={loginLocalization.EnterPassword}
                className="w-full px-4 py-2 text-sm border bg-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute left-3 top-10 text-gray-500 hover:text-gray-700"
                tabIndex={-1}
              >
                {showPassword ? <MdRemoveRedEye /> : <IoEyeOffSharp />}
              </button>
            </div>

            {error && <div className="text-red-500 text-sm">{error}</div>}

            <div className="flex items-center justify-between">
              <div className="flex gap-1 items-center">
                <input
                  type="checkbox"
                  id="remember"
                  className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-0"
                />
                <label
                  htmlFor="remember"
                  className="ml-2 text-sm text-gray-600"
                >
                  {loginLocalization.RememberMe}
                </label>
              </div>
              <a href="#" className="text-sm text-blue-900 underline">
                {loginLocalization.ForgotPassword}
              </a>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-900 text-white py-2 rounded-lg hover:bg-blue-600 active:scale-95 transition duration-200"
            >
              {loginLocalization.Login}
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
