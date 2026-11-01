import { useContext, useState } from "react";
import { Globe, Users, Lock } from "lucide-react";
import OptionsMenu from "../../CreationReply/OptionsMenu/OptionsMenu";
import ImageModal from "../../../../../components/ImageModal/ImageModal";
import { NavLink } from "react-router-dom";
import { userDataContext } from "../../../../../Context/userData.Context";

interface PostContentProps {
  isSharedPost: boolean;
  displayedUser: any;
  DEFAULT_PHOTO: string;
  displayedCreatedAt?: string;
  displayedPrivacy?: string;
  isEditedLocally: boolean;
  isOwner: boolean;
  setIsEditOpen: (isOpen: boolean) => void;
  handleDeleteClick: () => void;
  loadingDelete: boolean;
  displayedBody?: string;
  displayedImage?: string;
  formatDate: (date?: string) => string;
  userId: string;
}

export default function PostContent({
  isSharedPost,
  displayedUser,
  DEFAULT_PHOTO,
  displayedCreatedAt,
  displayedPrivacy,
  isEditedLocally,
  isOwner,
  setIsEditOpen,
  handleDeleteClick,
  loadingDelete,
  displayedBody,
  displayedImage,
  formatDate,
  userId,
}: PostContentProps) {
  const userContext = useContext(userDataContext);
  const userData = userContext?.userData;
  const myID = userData?._id;
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  const getPrivacyIcon = (privacy?: string) => {
    switch (privacy) {
      case "friends":
        return <Users className="w-3 h-3 text-gray-400" />;
      case "private":
        return <Lock className="w-3 h-3 text-gray-400" />;
      default:
        return <Globe className="w-3 h-3 text-gray-400" />;
    }
  };

  return (
    <div
      className={
        isSharedPost
          ? "border border-gray-200 dark:border-[#343536] rounded-xl p-3 bg-gray-50/60 dark:bg-[#121213] mb-3"
          : ""
      }
    >
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2.5">
          <img
            src={displayedUser?.photo || DEFAULT_PHOTO}
            alt={displayedUser?.name || "User"}
            className={
              isSharedPost
                ? "w-7 h-7 rounded-full object-cover border border-gray-200 dark:border-[#343536]"
                : "w-8 h-8 rounded-full object-cover border border-gray-200 dark:border-[#343536]"
            }
            onError={(e) => {
              e.currentTarget.src = DEFAULT_PHOTO;
            }}
          />

          <NavLink
            to={userId === myID ? `/profile` : `/UserProfile/${userId}`}
            onClick={() => {
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="group"
          >
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="text-xs font-bold text-gray-900 dark:text-gray-100 group-hover:underline">
                  {displayedUser?.name || "Unknown User"}
                </h3>

                {displayedUser?.username && (
                  <span className="text-[11px] text-gray-400 dark:text-gray-500">
                    u/{displayedUser.username}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1.5 text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">
                <span>{formatDate(displayedCreatedAt)}</span>
                {displayedCreatedAt && <span>•</span>}
                <span title={displayedPrivacy || "public"}>
                  {getPrivacyIcon(displayedPrivacy)}
                </span>
                {isEditedLocally && (
                  <>
                    <span>•</span>
                    <span className="font-medium text-amber-500">Edited</span>
                  </>
                )}
              </div>
            </div>
          </NavLink>
        </div>

        {!isSharedPost && (
          <OptionsMenu
            isOwner={isOwner}
            onEdit={() => setIsEditOpen(true)}
            onDelete={handleDeleteClick}
            isDeleting={loadingDelete}
            editLabel="Edit Post"
            deleteLabel="Delete Post"
          />
        )}
      </div>

      {displayedBody && (
        <div className="mb-3 text-sm text-gray-900 dark:text-gray-100 leading-relaxed break-words whitespace-pre-line font-normal">
          {displayedBody}
        </div>
      )}

      {displayedImage && (
        <div
          onClick={() => setIsImageModalOpen(true)}
          className="mb-3 rounded-xl overflow-hidden border border-gray-200 dark:border-[#343536] bg-black/5 dark:bg-black/20 flex items-center justify-center max-h-[500px] cursor-pointer group relative"
        >
          <img
            src={displayedImage}
            alt="Post media"
            className="w-full h-auto max-h-[500px] object-contain transition duration-200 group-hover:scale-[1.005]"
          />
          <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition pointer-events-none" />
        </div>
      )}

      {/* Image Modal Lightbox */}
      {displayedImage && (
        <ImageModal
          isOpen={isImageModalOpen}
          onClose={() => setIsImageModalOpen(false)}
          imageUrl={displayedImage}
          altText="Post media full view"
          title="Post Photo"
        />
      )}
    </div>
  );
}
