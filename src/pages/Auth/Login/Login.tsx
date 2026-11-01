import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  loginSchema,
  type loginSchemaType,
} from "../../../schemas/auth.schema";

import axios from "axios";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

import { userDataContext } from "../../../Context/userData.Context";

export default function LoginationForm() {
  const [erorr, seterorr] = useState<string | null>(null);
  const [isLoding, setisLoding] = useState(false);

  const context = useContext(userDataContext);
  const Navigate = useNavigate();

  const form = useForm<loginSchemaType>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  const { register, handleSubmit, formState } = form;

  async function handelRegister(value: loginSchemaType) {
    setisLoding(true);
    seterorr(null);

    try {
      const loginResponse = await axios.post(
        "https://route-posts.routemisr.com/users/signin",
        value,
      );

      const token = loginResponse.data.data.token;
      localStorage.setItem("userToken", token);

      const profileResponse = await axios.get(
        "https://route-posts.routemisr.com/users/profile-data",
        {
          headers: {
            token,
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const user = profileResponse.data.data.user;

      if (!user) {
        throw new Error("User data not found in profile response");
      }

      if (!context) {
        throw new Error("UserDataProvider is missing");
      }

      context.setuserData(user);
      Navigate("/");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        seterorr(
          err.response?.data?.message || "Failed to login or load profile",
        );
      } else if (err instanceof Error) {
        seterorr(err.message);
      } else {
        seterorr("Something went wrong");
      }
    } finally {
      setisLoding(false);
    }
  }

  return (
    <div
      className="min-h-screen bg-[#dae0e6] dark:bg-[#0e1113] flex items-center justify-center p-4 transition-colors duration-200"
      dir="ltr"
    >
      <div className="bg-white dark:bg-[#1a1a1b] p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-[#343536] w-full max-w-md transition-all">
        {/* Header / Brand Logo */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-[#ff4500] rounded-full flex items-center justify-center text-white font-black text-2xl mx-auto mb-3 shadow-md shadow-[#ff4500]/20">
            S
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white tracking-tight">
            Log In
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            By continuing, you agree to our User Agreement and Privacy Policy.
          </p>
        </div>

        {/* Global Error Banner */}
        {erorr && (
          <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 text-xs font-medium text-center py-2.5 px-3 rounded-xl mb-4">
            {erorr}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit(handelRegister)}>
          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
              Email Address
            </label>
            <input
              {...register("email")}
              type="email"
              placeholder="name@example.com"
              className="w-full bg-[#f6f7f8] dark:bg-[#272729] text-xs sm:text-sm text-gray-900 dark:text-white px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-[#343536] focus:border-[#ff4500] focus:bg-white dark:focus:bg-[#121213] focus:outline-none transition"
            />
            {formState.errors.email?.message && (
              <p className="text-red-500 text-[11px] mt-1 font-medium">
                {formState.errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
              Password
            </label>
            <input
              {...register("password")}
              type="password"
              placeholder="••••••••"
              className="w-full bg-[#f6f7f8] dark:bg-[#272729] text-xs sm:text-sm text-gray-900 dark:text-white px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-[#343536] focus:border-[#ff4500] focus:bg-white dark:focus:bg-[#121213] focus:outline-none transition"
            />
            {formState.errors.password?.message && (
              <p className="text-red-500 text-[11px] mt-1 font-medium">
                {formState.errors.password.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoding}
            className="w-full mt-2 bg-[#ff4500] hover:bg-[#e03d00] disabled:bg-[#ff4500]/50 text-white font-bold py-2.5 rounded-full text-xs sm:text-sm transition duration-150 flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
          >
            {isLoding ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Logging in...</span>
              </>
            ) : (
              "Log In"
            )}
          </button>
        </form>

        {/* Register Redirect Link */}
        <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-5">
          New to social?{" "}
          <Link
            to="/Register"
            className="text-[#ff4500] font-bold hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
