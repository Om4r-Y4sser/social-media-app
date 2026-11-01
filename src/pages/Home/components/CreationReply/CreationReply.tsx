import { useState } from "react";
import { Heart } from "lucide-react";
import type { CommentReplyProps } from "../../../../types/post.type";

export default function CommentReply({ reply }: CommentReplyProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(reply?.likesCount ?? 0);

  const creatorName = reply?.commentCreator?.name || "Anonymous";
  const avatarLetter = creatorName.charAt(0).toUpperCase();

  const formatTime = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleLike = () => {
    setIsLiked((prev) => {
      setLikesCount((count) => Math.max(0, count + (prev ? -1 : 1)));
      return !prev;
    });
  };

  return (
    <div className="flex flex-col ml-3 sm:ml-5 pl-2.5 border-l-2 border-gray-200 dark:border-[#343536] mt-2" dir="ltr">
      <div className="flex items-start gap-2.5 bg-gray-50/60 dark:bg-[#121213] p-2.5 rounded-xl border border-gray-100 dark:border-[#272729] transition-colors">
        {/* Avatar */}
        <div className="shrink-0">
          {reply?.commentCreator?.photo ? (
            <img
              src={reply.commentCreator.photo}
              alt={creatorName}
              className="w-7 h-7 rounded-full object-cover border border-gray-200 dark:border-[#343536]"
            />
          ) : (
            <div className="w-7 h-7 rounded-full bg-[#ff4500] text-white flex items-center justify-center text-xs font-bold">
              {avatarLetter}
            </div>
          )}
        </div>

        {/* Reply Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-bold text-gray-900 dark:text-gray-100 truncate">
              {creatorName}
            </span>
            <span className="text-[10px] text-gray-400 dark:text-gray-500 shrink-0">
              {formatTime(reply?.createdAt)}
            </span>
          </div>

          <p className="text-xs text-gray-800 dark:text-gray-200 mt-1 break-words leading-relaxed font-normal">
            {reply?.content}
          </p>
          
          {reply?.image && (
            <img
              src={reply.image}
              alt="Comment attachment"
              className="w-full h-auto max-h-60 object-contain rounded-lg mt-2 border border-gray-200 dark:border-[#343536]"
            />
          )}

          {/* Actions */}
          <div className="flex items-center gap-3 mt-1.5">
            <button
              type="button"
              onClick={handleLike}
              className={`flex items-center gap-1 text-[11px] font-semibold transition cursor-pointer ${
                isLiked
                  ? "text-[#ff4500]"
                  : "text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              <Heart
                className={`w-3 h-3 ${isLiked ? "fill-[#ff4500]" : ""}`}
              />
              <span>{likesCount > 0 ? likesCount : "Upvote"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
