import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import LoaderApi from "../../../../components/LoaderApi/LoaderApi";
import { useNavigate, useParams } from "react-router-dom";
import PostCard from "../PostCard/PostCard";
import CreateComment from "../commentCreation/commentCreation";
import { IoClose } from "react-icons/io5";
import toast from "react-hot-toast";
import { useEffect } from "react";

export default function SinglePost() {
  const { id } = useParams();

  const navigate = useNavigate();

  const handleClose = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  function getPostDetails() {
    return axios.get(`https://route-posts.routemisr.com/posts/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    });
  }

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["getPostDetails", id],
    queryFn: getPostDetails,
    enabled: !!id,
  });

  if (isError) {
    toast.error("post not avalibal");
    return;
  }
  const post = data?.data?.data?.post;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 cursor-pointer"
      onClick={handleClose}
    >
      {/* Modal Container */}
      <div
        className="relative w-full max-w-2xl h-[85vh] sm:h-[90vh] bg-white dark:bg-[#1a1a1b] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 dark:border-[#343536] transition-colors cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 1. Header */}
        <div className="shrink-0 flex items-center justify-between p-3 sm:p-4 border-b border-gray-200 dark:border-[#343536] bg-white dark:bg-[#1a1a1b] z-10">
          <h2 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white mx-auto truncate max-w-[80%] text-center">
            {post?.user?.name ? `${post.user.name}'s Post` : "Post Details"}
          </h2>

          <button
            type="button"
            onClick={handleClose}
            className="absolute right-3 sm:right-4 top-3 w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-[#272729] dark:hover:bg-[#343536] text-gray-600 dark:text-gray-300 flex items-center justify-center transition cursor-pointer"
            title="Close"
          >
            <IoClose className="w-4 h-4" />
          </button>
        </div>

        {/* 2. Middle Content */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3">
          {isLoading ? (
            <div className="h-full flex justify-center items-center py-12">
              <LoaderApi fullScreen={false} />
            </div>
          ) : isError ? (
            <div className="py-8 text-center text-red-500 font-semibold text-xs sm:text-sm">
              {error && "Failed to load post"}
            </div>
          ) : post ? (
            <PostCard post={post} postDetails={true} />
          ) : (
            <div className="py-8 text-center text-gray-400 text-xs sm:text-sm">
              Post not found
            </div>
          )}
        </div>

        {/* 3. Sticky Bottom Input */}
        {post && (
          <div className="shrink-0 p-3 bg-white dark:bg-[#1a1a1b] border-t border-gray-200 dark:border-[#343536] z-10">
            <CreateComment postId={id as string} />
          </div>
        )}
      </div>
    </div>
  );
}
