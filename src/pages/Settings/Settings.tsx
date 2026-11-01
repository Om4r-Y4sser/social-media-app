import { useState } from "react";
import { Lock, KeyRound, ShieldCheck, Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";

export default function Settings() {
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [rePassword, setRePassword] = useState("");

  const changePasswordMutation = useMutation({
    mutationFn: async (data: { password: string; newPassword: string }) => {
      const token = localStorage.getItem("userToken");
      const res = await axios.patch(
        "https://route-posts.routemisr.com/users/change-password",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return res.data;
    },
    onSuccess: (response) => {
      toast.success("Password changed successfully!");
      if (response?.token) {
        localStorage.setItem("userToken", response.token);
      }
      setPassword("");
      setNewPassword("");
      setRePassword("");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to change password");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!password || !newPassword) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }

    if (rePassword && newPassword !== rePassword) {
      toast.error("New passwords do not match");
      return;
    }

    changePasswordMutation.mutate({ password, newPassword });
  };

  return (
    <div className="w-full space-y-4 pb-8">
      {/* Page Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-[#ff4500]" />
          <span>Account Security</span>
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Manage your password and security credentials.
        </p>
      </div>

      {/* Settings Card */}
      <div className="bg-white dark:bg-[#1a1a1b] rounded-xl p-5 sm:p-6 shadow-2xs border border-gray-200 dark:border-[#343536] transition-colors">
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Current Password */}
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
              Current Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#f6f7f8] dark:bg-[#272729] text-xs sm:text-sm text-gray-900 dark:text-gray-100 py-2.5 pl-10 pr-3.5 rounded-xl border border-gray-200 dark:border-[#343536] focus:outline-none focus:border-[#ff4500] focus:bg-white dark:focus:bg-[#121213] transition"
                required
              />
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
              New Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                <KeyRound className="w-4 h-4" />
              </span>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#f6f7f8] dark:bg-[#272729] text-xs sm:text-sm text-gray-900 dark:text-gray-100 py-2.5 pl-10 pr-3.5 rounded-xl border border-gray-200 dark:border-[#343536] focus:outline-none focus:border-[#ff4500] focus:bg-white dark:focus:bg-[#121213] transition"
                required
              />
            </div>
          </div>

          {/* Confirm New Password */}
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
              Confirm New Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                <KeyRound className="w-4 h-4" />
              </span>
              <input
                type="password"
                value={rePassword}
                onChange={(e) => setRePassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#f6f7f8] dark:bg-[#272729] text-xs sm:text-sm text-gray-900 dark:text-gray-100 py-2.5 pl-10 pr-3.5 rounded-xl border border-gray-200 dark:border-[#343536] focus:outline-none focus:border-[#ff4500] focus:bg-white dark:focus:bg-[#121213] transition"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={changePasswordMutation.isPending}
              className="px-5 py-2 bg-[#ff4500] hover:bg-[#e03d00] text-white text-xs font-bold rounded-full transition shadow-2xs cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
            >
              {changePasswordMutation.isPending && (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              )}
              <span>{changePasswordMutation.isPending ? "Updating..." : "Update Password"}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
