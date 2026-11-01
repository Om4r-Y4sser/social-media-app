import { useQuery } from "@tanstack/react-query";
import axios, { type AxiosError, type AxiosResponse } from "axios";
import LoaderApi from "../../components/LoaderApi/LoaderApi";
import PostCard from "./components/PostCard/PostCard";
import type { Post, PostsResponse } from "../../types/post.type";
import CreatePost from "./components/CreatePostBox/CreatePostBox";

export default function Home() {
  function getPost() {
    return axios.get<PostsResponse>(
      "https://route-posts.routemisr.com/posts?sort=-createdAt",
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      },
    );
  }

  const { data, isLoading, isError, error } = useQuery<
    AxiosResponse<PostsResponse>,
    AxiosError
  >({
    queryKey: ["getAllPost"],
    queryFn: getPost,
  });

  if (isLoading) {
    return <LoaderApi />;
  }

  if (isError) {
    return (
      <div className="bg-white dark:bg-[#1a1a1b] border border-red-200 dark:border-red-900/50 rounded-xl p-6 text-center shadow-2xs">
        <p className="text-sm font-semibold text-red-600 dark:text-red-400">
          {error.message || "Failed to load posts"}
        </p>
      </div>
    );
  }

  const posts = data?.data.data.posts || [];

  return (
    <div className="w-full space-y-3">
      {/* Create Post Prompt Box */}
      <CreatePost />

      {/* Feed Posts */}
      {posts.length > 0 ? (
        posts.map((post: Post) => (
          <PostCard key={post._id} post={post} postDetails={false} />
        ))
      ) : (
        <div className="bg-white dark:bg-[#1a1a1b] border border-gray-200 dark:border-[#343536] rounded-xl p-8 text-center shadow-2xs">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            No posts in your feed yet. Be the first to share something!
          </p>
        </div>
      )}
    </div>
  );
}
