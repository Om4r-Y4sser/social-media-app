import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import LoaderApi from "../../components/LoaderApi/LoaderApi";
import { UserPlus, UserCheck, FileText, X } from "lucide-react";
import toast from "react-hot-toast";
import PostCard from "../Home/components/PostCard/PostCard";
import { userDataContext } from "../../Context/userData.Context";

export default function UserProfile() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const userContext = useContext(userDataContext);

  const [modalType, setModalType] = useState<"followers" | "following" | null>(
    null,
  );

  useEffect(() => {
    if (!modalType) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setModalType(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [modalType]);

  const { data: profileRes, isLoading: isProfileLoading } = useQuery({
    queryKey: ["getUserProfileData", userId],
    queryFn: async () => {
      const token = localStorage.getItem("userToken");
      const res = await axios.get(
        `https://route-posts.routemisr.com/users/${userId}/profile`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      return res.data;
    },
    enabled: !!userId,
  });

  const { data: postsRes, isLoading: isPostsLoading } = useQuery({
    queryKey: ["getUserPosts", userId],
    queryFn: async () => {
      const token = localStorage.getItem("userToken");
      const res = await axios.get(
        `https://route-posts.routemisr.com/users/${userId}/posts`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      return res.data;
    },
    enabled: !!userId,
  });

  const profileData = profileRes?.data;
  const userInfo = profileData?.user;
  const userPosts = postsRes?.data?.posts || postsRes?.posts || [];

  const [isFollowing, setIsFollowing] = useState<boolean>(false);

  useEffect(() => {
    if (profileData?.isFollowing !== undefined) {
      setIsFollowing(profileData.isFollowing);
    }
  }, [profileData]);

  const { mutate: handleFollow, isPending: isFollowPending } = useMutation({
    mutationFn: async () => {
      const token = localStorage.getItem("userToken");
      return axios.put(
        `https://route-posts.routemisr.com/users/${userId}/follow`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
    },
    onSuccess: () => {
      setIsFollowing((prev) => !prev);
      toast.success(
        isFollowing ? "Unfollowed successfully" : "Followed successfully",
      );
      queryClient.invalidateQueries({
        queryKey: ["getUserProfileData", userId],
      });
      queryClient.invalidateQueries({ queryKey: ["getMyProfile"] });
      if (userContext?.getUserProfile) {
        userContext.getUserProfile();
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Something went wrong");
    },
  });

  if (isProfileLoading) {
    return (
      <div className="flex justify-center items-center py-16">
        <LoaderApi fullScreen={false} />
      </div>
    );
  }

  const currentList =
    modalType === "followers" ? userInfo?.followers : userInfo?.following;

  return (
    <div className="w-full space-y-3 pb-8">
      {/* Profile Header Card */}
      <div className="w-full bg-white dark:bg-[#1a1a1b] rounded-xl shadow-2xs border border-gray-200 dark:border-[#343536] overflow-hidden">
        {/* Cover Photo */}
        <div className="h-32 sm:h-44 w-full bg-gradient-to-r from-[#ff4500] via-[#ff6a00] to-[#1a1a1b] relative">
          <div className="absolute inset-0 bg-black/10"></div>
        </div>

        {/* Profile Details Section */}
        <div className="px-5 sm:px-6 pb-5 relative">
          <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between -mt-14 sm:-mt-16 mb-4 gap-3">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 text-center sm:text-left">
              <div className="relative">
                <img
                  src={
                    userInfo?.photo ||
                    "https://static.vecteezy.com/system/resources/previews/009/292/652/non_2x/default-avatar-icon-of-social-media-user-vector.jpg"
                  }
                  alt={userInfo?.name || "User"}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-white dark:border-[#1a1a1b] shadow-md bg-white"
                />
              </div>

              <div className="mb-0.5">
                <h1 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                  {userInfo?.name || "User Profile"}
                </h1>
                <p className="text-xs font-medium text-[#ff4500] mt-0.5">
                  u/{userInfo?.username || userInfo?.email?.split("@")[0] || "username"}
                </p>

                {/* Follower / Following Metric Links */}
                <div className="flex items-center justify-center sm:justify-start gap-3 mt-2 text-xs font-semibold text-gray-600 dark:text-gray-300">
                  <button
                    type="button"
                    onClick={() => setModalType("followers")}
                    className="hover:text-[#ff4500] transition cursor-pointer"
                  >
                    <strong className="text-gray-900 dark:text-white font-bold">
                      {userInfo?.followersCount || 0}
                    </strong>{" "}
                    Followers
                  </button>
                  <span>•</span>
                  <button
                    type="button"
                    onClick={() => setModalType("following")}
                    className="hover:text-[#ff4500] transition cursor-pointer"
                  >
                    <strong className="text-gray-900 dark:text-white font-bold">
                      {userInfo?.followingCount || 0}
                    </strong>{" "}
                    Following
                  </button>
                </div>
              </div>
            </div>

            {/* Follow / Following Button */}
            <div className="flex items-center gap-3 w-full sm:w-auto justify-center pb-1">
              <button
                type="button"
                onClick={() => handleFollow()}
                disabled={isFollowPending}
                className={`flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition cursor-pointer shadow-2xs disabled:opacity-50 ${
                  isFollowing
                    ? "bg-gray-100 dark:bg-[#272729] text-gray-700 dark:text-gray-200 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/20 border border-gray-200 dark:border-[#343536]"
                    : "bg-[#ff4500] hover:bg-[#e03d00] text-white"
                }`}
              >
                {isFollowing ? (
                  <>
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Following</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Follow</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-[#343536] pt-3 flex gap-4 text-xs font-bold text-gray-900 dark:text-white">
            <span className="border-b-2 border-[#ff4500] pb-2 cursor-pointer text-[#ff4500]">
              Posts ({userPosts.length})
            </span>
          </div>
        </div>
      </div>

      {/* User Posts Feed */}
      <div className="space-y-3">
        {isPostsLoading ? (
          <div className="flex justify-center py-10">
            <LoaderApi fullScreen={false} />
          </div>
        ) : userPosts.length > 0 ? (
          userPosts.map((post: any) => <PostCard key={post._id} post={post} />)
        ) : (
          <div className="text-center py-12 bg-white dark:bg-[#1a1a1b] rounded-xl border border-gray-200 dark:border-[#343536] shadow-2xs">
            <FileText className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
              No posts available yet.
            </p>
          </div>
        )}
      </div>

      {/* Followers / Following List Modal */}
      {modalType && (
        <div
          onClick={() => setModalType(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150 cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-[#1a1a1b] w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-[#343536] cursor-default"
          >
            {/* Header Modal */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-200 dark:border-[#343536]">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white capitalize">
                {modalType}
              </h3>
              <button
                type="button"
                onClick={() => setModalType(null)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#272729] transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* List */}
            <div className="max-h-80 overflow-y-auto p-3 space-y-1.5">
              {currentList && currentList.length > 0 ? (
                currentList.map((user: any) => {
                  const targetId = user._id || user.id;
                  return (
                    <div
                      key={targetId}
                      onClick={() => {
                        setModalType(null);
                        navigate(`/UserProfile/${targetId}`);
                      }}
                      className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#272729] transition cursor-pointer"
                    >
                      <img
                        src={
                          user.photo ||
                          "https://static.vecteezy.com/system/resources/previews/009/292/652/non_2x/default-avatar-icon-of-social-media-user-vector.jpg"
                        }
                        alt={user.name}
                        className="w-8 h-8 rounded-full object-cover border border-gray-200 dark:border-[#343536] shrink-0"
                      />
                      <div className="truncate">
                        <h4 className="text-xs font-semibold text-gray-900 dark:text-white hover:underline truncate">
                          {user.name}
                        </h4>
                        <p className="text-[10px] text-gray-400 truncate">
                          u/{user.username || "user"}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-gray-400 text-xs">
                  No {modalType} found.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
