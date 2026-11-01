import { Repeat2 } from "lucide-react";
import type { PostHeaderProps } from "../../../../../types/post.type";

export default function PostHeaderShare({
  user,
  formatData,
  isEditedLocally,
  postCreatAt,
  DEFAULTPHOTO,
  renderOptionsMenu,
}: PostHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-gray-200 dark:border-[#343536]">
      <div className="flex items-center gap-2.5">
        <img
          src={user?.photo || DEFAULTPHOTO}
          alt={user?.name || "User"}
          className="w-8 h-8 rounded-full object-cover border border-gray-200 dark:border-[#343536]"
          onError={(e) => {
            e.currentTarget.src = DEFAULTPHOTO;
          }}
        />

        <div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <h3 className="text-xs font-bold text-gray-900 dark:text-white">
              {user?.name || "Unknown User"}
            </h3>
            {user?.username && (
              <span className="text-[11px] text-gray-400 dark:text-gray-500">
                u/{user.username}
              </span>
            )}
            {isEditedLocally && (
              <span className="text-[10px] text-amber-500 font-medium">(Edited)</span>
            )}
          </div>

          <div className="flex items-center gap-1 text-[11px] text-[#ff4500] mt-0.5 font-medium">
            <Repeat2 className="w-3.5 h-3.5" />
            <span>Shared a post</span>
            <span className="text-gray-400">•</span>
            <span className="text-gray-400 dark:text-gray-500">
              {formatData(postCreatAt)}
            </span>
          </div>
        </div>
      </div>

      {renderOptionsMenu()}
    </div>
  );
}
