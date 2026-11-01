import { useContext, useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { userDataContext } from "../../../../Context/userData.Context";
import { Calendar, Users, Bookmark, UserCheck, Camera, Eye, X } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import ImageModal from "../../../../components/ImageModal/ImageModal";
import { FollowItem } from "./components/UserListItem";

const DEFAULT_PHOTO =
  "https://pub-3cba56bacf9f4965bbb0989e07dada12.r2.dev/linkedPosts/default-profile.png";

export default function ProfileHeader() {
  const userContext = useContext(userDataContext);
  const navigate = useNavigate();
  const userData = userContext?.userData;
  const setUserData = userContext?.setuserData;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  
  const [uploading, setUploading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [modalType, setModalType] = useState<"followers" | "following" | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!modalType) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setModalType(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [modalType]);

  if (!userData) return null;

  const uploadPhotoMutation = useMutation({
    mutationFn: (file: File) => {
      const token = localStorage.getItem("userToken");
      const formData = new FormData();
      formData.append("photo", file);

      return axios.put(
        "https://route-posts.routemisr.com/users/upload-photo",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    },
    onSuccess: (response) => {
      toast.success("Profile photo updated successfully!");
      setUploading(false);

      const newPhoto = response.data?.data?.photo;
      if (newPhoto && setUserData) {
        setUserData({ ...userData, photo: newPhoto });
      }
    },
    onError: (error: any) => {
      setUploading(false);
      toast.error(error.response?.data?.message || "Failed to upload photo");
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    setUploading(true);
    uploadPhotoMutation.mutate(file);
    setShowMenu(false);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
    setShowMenu(false);
  };

  const handleViewPhoto = () => {
    setShowPhotoModal(true);
    setShowMenu(false);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  const currentList = modalType === "followers" ? userData?.followers : userData?.following;

  return (
    <div className="w-full bg-white dark:bg-[#1a1a1b] rounded-xl shadow-2xs border border-gray-200 dark:border-[#343536] transition-colors duration-200 overflow-hidden">
      
      {/* Reddit-style Profile Banner */}
      <div className="h-32 sm:h-44 w-full bg-gradient-to-r from-[#ff4500] via-[#ff6a00] to-[#1a1a1b] relative">
        <div className="absolute inset-0 bg-black/10"></div>
      </div>

      <div className="px-5 sm:px-6 pb-5 relative">
        <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between -mt-14 sm:-mt-16 gap-3">
          
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 text-center sm:text-left">
            <div className="relative group" ref={menuRef}>
              <button
                type="button"
                disabled={uploading}
                onClick={() => setShowMenu((prev) => !prev)}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-white dark:border-[#1a1a1b] shadow-md group relative overflow-hidden cursor-pointer bg-white"
                aria-label="Profile photo options"
              >
                <img
                  src={userData.photo || DEFAULT_PHOTO}
                  alt={userData.name}
                  className="w-full h-full object-cover transition duration-200 group-hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.src = DEFAULT_PHOTO;
                  }}
                />
                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition text-white">
                  <Camera className="w-5 h-5" />
                </div>
              </button>

              {showMenu && (
                <div className="absolute left-1/2 bottom-[calc(100%+8px)] -translate-x-1/2 z-50 w-44 overflow-hidden rounded-xl border border-gray-200 dark:border-[#343536] bg-white dark:bg-[#1a1a1b] shadow-xl animate-in fade-in zoom-in-95 duration-100 py-1 text-left">
                  <button
                    type="button"
                    onClick={handleViewPhoto}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#272729] transition cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#ff4500]" />
                    <span>View photo</span>
                  </button>
                  <button
                    type="button"
                    disabled={uploading}
                    onClick={handleUploadClick}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#272729] transition disabled:opacity-50 cursor-pointer border-t border-gray-100 dark:border-[#272729]"
                  >
                    <Camera className="w-3.5 h-3.5 text-[#ff4500]" />
                    <span>{uploading ? "Uploading..." : "Upload photo"}</span>
                  </button>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            <div className="mb-0.5">
              <h1 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                {userData.name}
              </h1>
              <p className="text-xs font-medium text-[#ff4500] mt-0.5">
                u/{userData.username}
              </p>

              <div className="flex items-center justify-center sm:justify-start gap-1.5 text-[11px] font-medium text-gray-500 dark:text-gray-400 mt-1.5">
                <Calendar className="w-3 h-3 text-gray-400" />
                <span>Joined {formatDate(userData.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Metric Cards (Followers, Following, Bookmarks) */}
        <div className="grid grid-cols-3 gap-2.5 mt-5 pt-4 border-t border-gray-200 dark:border-[#343536] text-center">
          
          <button
            type="button"
            onClick={() => setModalType("followers")}
            className="p-2.5 rounded-xl bg-[#f6f7f8] dark:bg-[#121213] hover:bg-gray-100 dark:hover:bg-[#272729] transition cursor-pointer group border border-gray-200 dark:border-[#343536]"
          >
            <div className="flex items-center justify-center gap-1.5 text-gray-500 dark:text-gray-400 text-[11px] font-semibold mb-0.5 group-hover:text-[#ff4500]">
              <Users className="w-3.5 h-3.5 text-[#ff4500]" />
              <span>Followers</span>
            </div>
            <span className="text-base font-bold text-gray-900 dark:text-white">
              {userData.followersCount || 0}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setModalType("following")}
            className="p-2.5 rounded-xl bg-[#f6f7f8] dark:bg-[#121213] hover:bg-gray-100 dark:hover:bg-[#272729] transition cursor-pointer group border border-gray-200 dark:border-[#343536]"
          >
            <div className="flex items-center justify-center gap-1.5 text-gray-500 dark:text-gray-400 text-[11px] font-semibold mb-0.5 group-hover:text-[#ff4500]">
              <UserCheck className="w-3.5 h-3.5 text-[#ff4500]" />
              <span>Following</span>
            </div>
            <span className="text-base font-bold text-gray-900 dark:text-white">
              {userData.followingCount || 0}
            </span>
          </button>

          <div className="p-2.5 rounded-xl bg-[#f6f7f8] dark:bg-[#121213] text-center border border-gray-200 dark:border-[#343536]">
            <div className="flex items-center justify-center gap-1.5 text-gray-500 dark:text-gray-400 text-[11px] font-semibold mb-0.5">
              <Bookmark className="w-3.5 h-3.5 text-[#ff4500]" />
              <span>Bookmarks</span>
            </div>
            <span className="text-base font-bold text-gray-900 dark:text-white">
              {userData.bookmarksCount || 0}
            </span>
          </div>
        </div>

        {/* Image Modal Lightbox */}
        <ImageModal
          isOpen={showPhotoModal}
          onClose={() => setShowPhotoModal(false)}
          imageUrl={userData.photo || DEFAULT_PHOTO}
          altText={userData.name}
          title="Profile Photo"
        />

        {/* Followers / Following Modal */}
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
                  currentList.map((idItem: any) => {
                    const targetId = typeof idItem === "string" ? idItem : idItem._id || idItem.id;
                    const isMyAccount = targetId === userData?._id;

                    return (
                      <FollowItem
                        key={targetId}
                        userId={targetId}
                        onClick={() => {
                          setModalType(null);
                          if (isMyAccount) {
                            navigate(`/profile`);
                          } else {
                            navigate(`/UserProfile/${targetId}`);
                          }
                        }}
                      />
                    );
                  })
                ) : (
                  <div className="text-center py-8 text-gray-400 text-xs font-medium">
                    No {modalType} found.
                  </div>
                )}
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}
