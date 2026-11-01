import { useState, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import LoaderApi from "../../../../components/LoaderApi/LoaderApi";
import { Bookmark, FileText } from "lucide-react";
import { userDataContext } from "../../../../Context/userData.Context";
import PostCard from "../../../Home/components/PostCard/PostCard";

export default function ProfileTabs() {
  const [activeTab, setActiveTab] = useState<"posts" | "bookmarks">("posts");

  const userContext = useContext(userDataContext);
  const userId = userContext?.userData?._id;

  const { data: postsData, isLoading: postsLoading } = useQuery({
    queryKey: ["getUserPosts", userId],
    queryFn: () => {
      const token = localStorage.getItem("userToken");
      return axios.get(
        `https://route-posts.routemisr.com/users/${userId}/posts`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    },
    enabled: !!userId,
  });

  const { data: bookmarksData, isLoading: bookmarksLoading } = useQuery({
    queryKey: ["getUserBookmarks"],
    queryFn: () => {
      const token = localStorage.getItem("userToken");
      return axios.get("https://route-posts.routemisr.com/users/bookmarks", {
        headers: { Authorization: `Bearer ${token}` },
      });
    },
  });

  const myPosts = postsData?.data?.data?.posts || postsData?.data?.posts || [];
  const bookmarksPosts = bookmarksData?.data?.data?.bookmarks || [];

  return (
    <div className="w-full">
      {/* Tabs Header */}
      <div className="flex bg-white dark:bg-[#1a1a1b] border border-gray-200 dark:border-[#343536] rounded-xl p-1 mb-3 shadow-2xs gap-1">
        <button
          type="button"
          onClick={() => setActiveTab("posts")}
          className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition cursor-pointer ${
            activeTab === "posts"
              ? "bg-[#ff4500] text-white shadow-2xs font-bold"
              : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#272729]"
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>My Posts ({myPosts.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("bookmarks")}
          className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition cursor-pointer ${
            activeTab === "bookmarks"
              ? "bg-[#ff4500] text-white shadow-2xs font-bold"
              : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#272729]"
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span>Saved Posts ({bookmarksPosts.length})</span>
        </button>
      </div>

      {/* Tabs Content */}
      <div className="space-y-3">
        {activeTab === "posts" && (
          <>
            {postsLoading ? (
              <LoaderApi fullScreen={false} />
            ) : myPosts.length > 0 ? (
              myPosts.map((post: any) => <PostCard key={post._id} post={post} />)
            ) : (
              <div className="text-center py-10 bg-white dark:bg-[#1a1a1b] rounded-xl border border-gray-200 dark:border-[#343536] shadow-2xs">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  You haven't posted anything yet.
                </p>
              </div>
            )}
          </>
        )}

        {activeTab === "bookmarks" && (
          <>
            {bookmarksLoading ? (
              <LoaderApi fullScreen={false} />
            ) : bookmarksPosts.length > 0 ? (
              bookmarksPosts.map((post: any) => <PostCard key={post._id} post={post} />)
            ) : (
              <div className="text-center py-10 bg-white dark:bg-[#1a1a1b] rounded-xl border border-gray-200 dark:border-[#343536] shadow-2xs">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  No saved bookmarks found.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
