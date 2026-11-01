import { Link } from "react-router-dom";
import {
  MessageSquare,
  Share2,
  Bookmark,
} from "lucide-react";
import { BiLike } from "react-icons/bi";

interface PostActionsProps {
  isLiked: boolean;
  isPending: boolean;
  loadingShare: boolean;
  loadingBookmarked: boolean;
  isBookmarked: boolean;

  mutate: () => void;
  mutateShare: () => void;
  mutateBookmark: () => void;

  postId: string;
  postDetails: boolean;
}

export default function PostActions({
  isLiked,
  isPending,
  loadingShare,
  loadingBookmarked,
  isBookmarked,
  mutate,
  mutateShare,
  mutateBookmark,
  postId,
  postDetails,
}: PostActionsProps) {
  return (
    <div className="flex items-center gap-1.5 sm:gap-2 pt-1 flex-wrap">
      {/* Upvote / Like Pill */}
      <button
        disabled={isPending}
        onClick={mutate}
        className={`cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition ${
          isLiked
            ? "text-[#ff4500] bg-[#ff4500]/10 dark:bg-[#ff4500]/20 font-bold"
            : "text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-[#272729] hover:bg-gray-200 dark:hover:bg-[#343536]"
        }`}
      >
        <BiLike 
          className={`w-3.5 h-3.5 ${isLiked ? "fill-[#ff4500] text-[#ff4500]" : ""}`}
        />
        <span>{isPending ? "Updating..." : isLiked ? "Upvoted" : "Upvote"}</span>
      </button>

      {/* Comment Pill */}
      {postDetails ? (
        <button className="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-[#272729] hover:bg-gray-200 dark:hover:bg-[#343536] transition">
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Comments</span>
        </button>
      ) : (
        <Link
          to={`/postDetails/${postId}`}
          className="flex items-center"
        >
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-[#272729] hover:bg-gray-200 dark:hover:bg-[#343536] transition">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Comments</span>
          </span>
        </Link>
      )}

      {/* Share Pill */}
      <button
        disabled={loadingShare}
        onClick={mutateShare}
        className="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-[#272729] hover:bg-gray-200 dark:hover:bg-[#343536] transition disabled:opacity-50"
      >
        <Share2 className="w-3.5 h-3.5" />
        <span>{loadingShare ? "Sharing..." : "Share"}</span>
      </button>

      {/* Bookmark Pill */}
      <button
        disabled={loadingBookmarked}
        onClick={mutateBookmark}
        className={`cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition ml-auto ${
          isBookmarked
            ? "text-[#ff4500] bg-[#ff4500]/10 dark:bg-[#ff4500]/20 font-bold"
            : "text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-[#272729] hover:bg-gray-200 dark:hover:bg-[#343536]"
        }`}
        title={isBookmarked ? "Remove Bookmark" : "Save Post"}
      >
        <Bookmark
          className={`w-3.5 h-3.5 ${isBookmarked ? "fill-[#ff4500]" : ""}`}
        />
        <span className="hidden sm:inline">{isBookmarked ? "Saved" : "Save"}</span>
      </button>
    </div>
  );
}
