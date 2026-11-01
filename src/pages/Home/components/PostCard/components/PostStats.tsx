interface PostStatsProps {
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
}

export default function PostStats({
  likesCount,
  commentsCount,
  sharesCount,
}: PostStatsProps) {
  return (
    <div className="flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400 pb-2 mb-1.5 border-b border-gray-100 dark:border-[#272729]">
      <div className="flex items-center gap-1.5">
        <span className="w-4 h-4 rounded-full bg-[#ff4500] text-white flex items-center justify-center text-[9px] font-bold">
          ▲
        </span>
        <span className="font-semibold">{likesCount} {likesCount === 1 ? "Upvote" : "Upvotes"}</span>
      </div>
      <div className="flex items-center gap-3">
        <span>{commentsCount} {commentsCount === 1 ? "comment" : "comments"}</span>
        <span>•</span>
        <span>{sharesCount} {sharesCount === 1 ? "share" : "shares"}</span>
      </div>
    </div>
  );
}
