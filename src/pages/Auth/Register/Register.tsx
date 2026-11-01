import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  RegisterSchema,
  type RegisterSchemaType,
} from "../../../schemas/auth.schema";
import axios from "axios";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Loader2 } from "lucide-react";

export default function RegistrationForm() {
  const [erorr, seterorr] = useState<string | null>(null);
  const [isLoding, setisLoding] = useState<boolean>(false);
  const Navigate = useNavigate();

  const form = useForm<RegisterSchemaType>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      rePassword: "",
      dateOfBirth: "",
      gender: "male",
    },
    resolver: zodResolver(RegisterSchema),
    mode: "onChange",
  });

  const { register, handleSubmit, formState } = form;

  function handelRegister(vlaue: RegisterSchemaType) {
    setisLoding(true);
    seterorr(null);
    axios
      .post("https://route-posts.routemisr.com/users/signup", vlaue)
      .then(() => {
        Navigate("/login");
      })
      .catch((err) => {
        seterorr(err.response?.data?.message || "An error occurred during registration");
      })
      .finally(() => {
        setisLoding(false);
      });
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
            Create an Account
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Join the community and start connecting with people.
          </p>
        </div>

        {/* Global Error Banner */}
        {erorr && (
          <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 text-xs font-medium text-center py-2.5 px-3 rounded-xl mb-4">
            {erorr}
          </div>
        )}

        <form className="space-y-3.5" onSubmit={handleSubmit(handelRegister)}>
          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
              Full Name
            </label>
            <input
              {...register("name")}
              type="text"
              placeholder="Your Name"
              className="w-full bg-[#f6f7f8] dark:bg-[#272729] text-xs sm:text-sm text-gray-900 dark:text-white px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-[#343536] focus:border-[#ff4500] focus:bg-white dark:focus:bg-[#121213] focus:outline-none transition"
            />
            {formState.errors.name?.message && (
              <p className="text-red-500 text-[11px] mt-1 font-medium">
                {formState.errors.name.message}
              </p>
            )}
          </div>

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

          {/* Date of Birth & Gender Grid */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                Date of Birth
              </label>
              <input
                {...register("dateOfBirth")}
                type="date"
                defaultValue="2000-01-01"
                className="w-full bg-[#f6f7f8] dark:bg-[#272729] text-xs text-gray-900 dark:text-white px-3 py-2.5 rounded-xl border border-gray-200 dark:border-[#343536] focus:border-[#ff4500] focus:bg-white dark:focus:bg-[#121213] focus:outline-none transition"
              />
              {formState.errors.dateOfBirth?.message && (
                <p className="text-red-500 text-[11px] mt-1 font-medium">
                  {formState.errors.dateOfBirth.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                Gender
              </label>
              <select
                defaultValue="male"
                {...register("gender")}
                className="w-full bg-[#f6f7f8] dark:bg-[#272729] text-xs text-gray-900 dark:text-white px-3 py-2.5 rounded-xl border border-gray-200 dark:border-[#343536] focus:border-[#ff4500] focus:bg-white dark:focus:bg-[#121213] focus:outline-none transition"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
              {formState.errors.gender?.message && (
                <p className="text-red-500 text-[11px] mt-1 font-medium">
                  {formState.errors.gender.message}
                </p>
              )}
            </div>
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

          {/* Confirm Password */}
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              {...register("rePassword")}
              placeholder="••••••••"
              className="w-full bg-[#f6f7f8] dark:bg-[#272729] text-xs sm:text-sm text-gray-900 dark:text-white px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-[#343536] focus:border-[#ff4500] focus:bg-white dark:focus:bg-[#121213] focus:outline-none transition"
            />
            {formState.errors.rePassword?.message && (
              <p className="text-red-500 text-[11px] mt-1 font-medium">
                {formState.errors.rePassword.message}
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
                <span>Signing up...</span>
              </>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        {/* Login Link */}
        <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-5">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-[#ff4500] font-bold hover:underline"
          >
            Log In
          </Link>
        </p>

      </div>
    </div>
  );
}
