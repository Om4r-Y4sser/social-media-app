import { useState, useContext, useEffect } from "react";
import { UserPlus, Users, X } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { userDataContext } from "../../Context/userData.Context";
import { FollowItem } from "../../pages/Profile/components/ProfileHeader/components/UserListItem";

export default function RightSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showSeeMoreModal, setShowSeeMoreModal] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  useEffect(() => {
    if (!showSeeMoreModal) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowSeeMoreModal(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showSeeMoreModal]);

  // جلب بيانات اليوزر من الـ Context عشان نقرأ منها الـ following
  const userContext = useContext(userDataContext);
  const userData = userContext?.userData;
  const myFollowingIds = userData?.following || [];

  // 1. جلب اقتراحات المتابعة (Who to Follow)
  const { data: suggestionsData, isLoading: isSuggestionsLoading } = useQuery({
    queryKey: ["userSuggestions"],
    queryFn: async () => {
      const token = localStorage.getItem("userToken");
      const res = await axios.get(
        "https://route-posts.routemisr.com/users/suggestions?limit=10",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data;
    },
  });

  const suggestionsList = suggestionsData?.data.suggestions || suggestionsData?.users || suggestionsData || [];

  // 2. Mutation لعمل Follow
  const { mutate: handleFollow, isPending: isFollowPending } = useMutation({
    mutationFn: async (userId: string) => {
      const token = localStorage.getItem("userToken");
      return axios.put(
        `https://route-posts.routemisr.com/users/${userId}/follow`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    },
    onSuccess: () => {
      toast.success("Followed successfully!");
      queryClient.invalidateQueries({ queryKey: ["userSuggestions"] });
      queryClient.invalidateQueries({ queryKey: ["getMyProfile"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Something went wrong");
    },
  });

  return (
    <>
      {/* Floating Toggle Button (Mobile) */}
      <button
        onClick={() => setIsOpen(true)}
        className="xl:hidden fixed bottom-18 sm:bottom-5 right-4 z-40 p-3 bg-[#ff4500] text-white rounded-full shadow-lg hover:bg-[#e03d00] transition-all cursor-pointer"
        aria-label="Open Sidebar"
      >
        <Users className="w-5 h-5" />
      </button>

      {/* Backdrop Overlay (Mobile) */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="xl:hidden fixed inset-0 bg-black/50 backdrop-blur-xs z-40 transition-opacity"
        />
      )}

      {/* Main Responsive Sidebar Container */}
      <aside
        className={`
          fixed xl:sticky top-0 xl:top-14 right-0 z-50 xl:z-auto
          w-80 xl:w-76 h-screen xl:h-[calc(100vh-3.5rem)]
          bg-white dark:bg-[#1a1a1b] text-gray-800 dark:text-gray-100 p-4 
          flex flex-col gap-4 overflow-y-auto
          border-l border-gray-200 dark:border-[#343536] 
          transition-transform duration-200 ease-in-out
          ${isOpen ? "translate-x-0" : "translate-x-full xl:translate-x-0"}
        `}
        dir="ltr"
      >
        {/* Close Button (Mobile) */}
        <div className="flex xl:hidden items-center justify-between pb-2 border-b border-gray-200 dark:border-[#343536]">
          <span className="font-bold text-xs uppercase tracking-wider text-gray-800 dark:text-white">Community Widgets</span>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section 1: Who to Follow (Reddit Community Card Style) */}
        <div className="bg-gray-50/70 dark:bg-[#121213] border border-gray-200 dark:border-[#343536] rounded-xl p-3.5 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-gray-900 dark:text-white text-xs uppercase tracking-wider">
              Who to Follow
            </h3>
            <span className="text-[10px] text-gray-400 font-medium">Recommended</span>
          </div>

          <div className="space-y-3">
            {isSuggestionsLoading ? (
              <div className="text-xs text-gray-400 text-center py-4">Loading suggestions...</div>
            ) : suggestionsList.length > 0 ? (
              suggestionsList.slice(0, 4).map((user: any) => {
                const targetId = user._id || user.id;
                return (
                  <div key={targetId} className="flex items-center justify-between gap-2">
                    <div 
                      onClick={() => {
                        setIsOpen(false);
                        navigate(`/UserProfile/${targetId}`);
                      }}
                      className="flex items-center gap-2.5 min-w-0 cursor-pointer group flex-1"
                    >
                      <img
                        src={user.photo || "https://pub-3cba56bacf9f4965bbb0989e07dada12.r2.dev/linkedPosts/default-profile.png"}
                        alt={user.name}
                        className="w-8 h-8 rounded-full object-cover shrink-0 border border-gray-200 dark:border-[#343536]"
                      />
                      <div className="truncate min-w-0">
                        <h4 className="text-xs font-bold text-gray-900 dark:text-gray-100 leading-tight truncate group-hover:underline">
                          {user.name}
                        </h4>
                        <p className="text-[10px] text-gray-400 dark:text-gray-500 truncate">
                          u/{user.username || user.email?.split('@')[0] || "user"}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleFollow(targetId)}
                      disabled={isFollowPending}
                      className="px-2.5 py-1 bg-[#ff4500] hover:bg-[#e03d00] text-white rounded-full flex items-center gap-1 text-[11px] font-semibold transition shadow-2xs shrink-0 cursor-pointer disabled:opacity-50"
                      title="Follow"
                    >
                      <UserPlus className="w-3 h-3" />
                      <span>Follow</span>
                    </button>
                  </div>
                );
              })
            ) : (
              <div className="text-xs text-gray-400 text-center py-4">No suggestions available</div>
            )}
          </div>

          {suggestionsList.length > 4 && (
            <button
              onClick={() => setShowSeeMoreModal(true)}
              className="w-full text-center text-[11px] font-bold text-[#ff4500] hover:underline mt-3 pt-2 border-t border-gray-200 dark:border-[#343536] transition cursor-pointer"
            >
              See more suggestions
            </button>
          )}
        </div>

        {/* Section 2: Following */}
        <div className="bg-gray-50/70 dark:bg-[#121213] border border-gray-200 dark:border-[#343536] rounded-xl p-3.5 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-gray-900 dark:text-white text-xs uppercase tracking-wider">
              Following ({myFollowingIds.length})
            </h3>
          </div>

          <div className="space-y-1.5 max-h-64 overflow-y-auto">
            {myFollowingIds.length > 0 ? (
              myFollowingIds.map((idItem: any) => {
                const friendId = typeof idItem === "string" ? idItem : idItem._id || idItem.id;
                const isMyAccount = friendId === userData?._id;

                return (
                  <FollowItem
                    key={friendId}
                    userId={friendId}
                    onClick={() => {
                      setIsOpen(false);
                      if (isMyAccount) {
                        navigate(`/profile`);
                      } else {
                        navigate(`/UserProfile/${friendId}`);
                      }
                    }}
                  />
                );
              })
            ) : (
              <div className="text-xs text-gray-400 text-center py-3">
                You are not following anyone yet.
              </div>
            )}
          </div>
        </div>

        {/* Footer info links - Reddit style */}
        <div className="px-1 text-[11px] text-gray-400 dark:text-gray-500 space-y-1">
          <div className="flex flex-wrap gap-x-2 gap-y-1">
            <span className="hover:underline cursor-pointer">User Agreement</span>
            <span>•</span>
            <span className="hover:underline cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:underline cursor-pointer">Content Policy</span>
          </div>
          <p className="pt-2 text-[10px]">Social Inc. © 2026. All rights reserved.</p>
        </div>
      </aside>

      {/* Modal See more */}
      {showSeeMoreModal && (
        <div
          onClick={() => setShowSeeMoreModal(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-[#1a1a1b] w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-[#343536] animate-in fade-in zoom-in-95 duration-150 cursor-default"
          >
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-200 dark:border-[#343536]">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                Who to Follow
              </h3>
              <button
                onClick={() => setShowSeeMoreModal(false)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#272729] transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-80 overflow-y-auto p-3 space-y-2">
              {suggestionsList.map((user: any) => {
                const targetId = user._id || user.id;
                return (
                  <div
                    key={targetId}
                    className="flex items-center justify-between gap-3 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-[#272729] transition"
                  >
                    <div
                      onClick={() => {
                        setShowSeeMoreModal(false);
                        setIsOpen(false);
                        navigate(`/UserProfile/${targetId}`);
                      }}
                      className="flex items-center gap-2.5 min-w-0 cursor-pointer flex-1"
                    >
                      <img
                        src={user.photo || "https://pub-3cba56bacf9f4965bbb0989e07dada12.r2.dev/linkedPosts/default-profile.png"}
                        alt={user.name}
                        className="w-9 h-9 rounded-full object-cover border border-gray-200 dark:border-[#343536] shrink-0"
                      />
                      <div className="truncate">
                        <h4 className="text-xs font-bold text-gray-900 dark:text-white hover:underline truncate">
                          {user.name}
                        </h4>
                        <p className="text-[10px] text-gray-400 truncate">
                          u/{user.username || user.email?.split('@')[0] || "user"}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleFollow(targetId)}
                      disabled={isFollowPending}
                      className="px-3 py-1 bg-[#ff4500] hover:bg-[#e03d00] text-white rounded-full text-xs font-semibold transition shadow-2xs shrink-0 cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Follow</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
