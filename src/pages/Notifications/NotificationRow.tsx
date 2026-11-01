import {
  Bell,
  Check,
  MessageCircle,
  Share2,
  ThumbsUp,
} from "lucide-react";

export interface NotificationItem {
  _id: string;
  type: "comment_post" | "like_post" | "share_post" | string;
  createdAt: string;
  isRead: boolean;
  actor?: {
    _id: string;
    name: string;
    photo: string;
  };
  entityType?: string;
  entityId?: string;
}

interface NotificationRowProps {
  item: NotificationItem;
  onOpen: (item: NotificationItem) => void;
  onMarkRead: (id: string) => void;
}

const DEFAULT_AVATAR =
  "https://pub-3cba56bacf9f4965bbb0989e07dada12.r2.dev/linkedPosts/default-profile.png";

const ACTION_TEXT: Record<string, string> = {
  comment_post: "commented on your post.",
  like_post: "upvoted your post.",
  share_post: "shared your post.",
};

const BADGE: Record<
  string,
  { bg: string; icon: React.ReactNode }
> = {
  like_post: {
    bg: "bg-[#ff4500]",
    icon: (
      <ThumbsUp className="w-2.5 h-2.5 text-white fill-white" />
    ),
  },

  comment_post: {
    bg: "bg-blue-500",
    icon: (
      <MessageCircle className="w-2.5 h-2.5 text-white fill-white" />
    ),
  },

  share_post: {
    bg: "bg-purple-500",
    icon: <Share2 className="w-2.5 h-2.5 text-white" />,
  },
};

function getTimeAgo(dateString: string) {
  const seconds = Math.floor(
    (Date.now() - new Date(dateString).getTime()) / 1000
  );

  if (seconds < 60) return "Just now";

  const minutes = Math.floor(seconds / 60);

  if (minutes < 60) return `${minutes}m`;

  const hours = Math.floor(minutes / 60);

  if (hours < 24) return `${hours}h`;

  const days = Math.floor(hours / 24);

  if (days < 7) return `${days}d`;

  const weeks = Math.floor(days / 7);

  if (weeks < 5) return `${weeks}w`;

  return new Date(dateString).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

function TypeBadge({ type }: { type: string }) {
  const badge = BADGE[type] ?? {
    bg: "bg-[#ff4500]",
    icon: <Bell className="w-2.5 h-2.5 text-white" />,
  };

  return (
    <span
      className={`absolute -bottom-0.5 -right-0.5 w-4.5 h-4.5 ${badge.bg} rounded-full flex items-center justify-center ring-2 ring-white dark:ring-[#1a1a1b] shadow-2xs`}
    >
      {badge.icon}
    </span>
  );
}

export default function NotificationRow({
  item,
  onOpen,
  onMarkRead,
}: NotificationRowProps) {
  const unread = !item.isRead;
  const actorName = item.actor?.name || "Someone";
  const action = ACTION_TEXT[item.type] ?? "interacted with your account.";

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onOpen(item)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          onOpen(item);
        }
      }}
      className="group relative flex items-start gap-2.5 p-2.5 mx-1.5 my-0.5 rounded-lg cursor-pointer transition hover:bg-gray-100 dark:hover:bg-[#272729] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff4500]"
    >
      {/* Avatar + Type Badge */}
      <div className="relative shrink-0 mt-0.5">
        <img
          src={item.actor?.photo || DEFAULT_AVATAR}
          alt={actorName}
          className="w-9 h-9 rounded-full object-cover border border-gray-200 dark:border-[#343536]"
        />
        <TypeBadge type={item.type} />
      </div>

      {/* Notification Text + Time */}
      <div className="flex-1 min-w-0">
        <p
          className={`text-xs leading-snug ${
            unread
              ? "text-gray-900 dark:text-white font-medium"
              : "text-gray-500 dark:text-gray-400"
          }`}
        >
          <span className="font-bold">{actorName}</span>{" "}
          {action}
        </p>

        <span
          className={`text-[10px] mt-0.5 block ${
            unread
              ? "text-[#ff4500] font-semibold"
              : "text-gray-400 dark:text-gray-500"
          }`}
        >
          {getTimeAgo(item.createdAt)}
        </span>
      </div>

      {/* Mark as Read */}
      {unread && (
        <div className="flex items-center gap-1 self-center shrink-0">
          <button
            type="button"
            title="Mark as read"
            aria-label="Mark as read"
            onClick={(e) => {
              e.stopPropagation();
              onMarkRead(item._id);
            }}
            className="sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100 p-1 rounded-full text-gray-500 hover:bg-gray-200 dark:hover:bg-[#343536] transition cursor-pointer"
          >
            <Check className="w-3.5 h-3.5" />
          </button>

          <span className="w-2 h-2 bg-[#ff4500] rounded-full" />
        </div>
      )}
    </div>
  );
}
