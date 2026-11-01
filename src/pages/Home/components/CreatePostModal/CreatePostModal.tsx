import { useRef, useContext, useEffect } from "react";
import { Image, X, Globe, Smile, Video } from "lucide-react";
import { userDataContext } from "../../../../Context/userData.Context";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  selectedImage: string | null;
  selectedFile: File | null;
  setSelectedImage: (image: string | null) => void;
  setSelectedFile: (file: File | null) => void;

  // 👈 مخصصة للتعديل (Update)
  isEditMode?: boolean;
  postId?: string;
  initialBody?: string;
  setIsEditedLocally?: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function CreatePostModal({
  isOpen,
  onClose,
  selectedImage,
  selectedFile,
  setSelectedImage,
  setSelectedFile,
  handleImageChange,
  isEditMode = false,
  postId,
  initialBody = "",
  setIsEditedLocally,
}: CreatePostModalProps) {
  const query = useQueryClient();
  const user = useContext(userDataContext);
  const userData = user?.userData;

  const textInputRef = useRef<HTMLTextAreaElement>(null);

  // لو احنا في وضع التعديل، نحط النص القديم جوه الـ textarea أول ما المودل يفتح
  useEffect(() => {
    if (isOpen && textInputRef.current) {
      textInputRef.current.value = initialBody;
    }
  }, [isOpen, initialBody]);

  // إغلاق المودال بزر Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // دالة الإرسال (تفرق بين إنشاء بوست جديد أو تعديل بوست موجود)
  const mutationFn = (formdata: FormData) => {
    const token = localStorage.getItem("userToken");
    const headers = {
      token: token || "",
      Authorization: `Bearer ${token}`,
    };

    if (isEditMode && postId) {
      return axios.put(
        `https://route-posts.routemisr.com/posts/${postId}`,
        formdata,
        { headers },
      );
    } else {
      return axios.post(`https://route-posts.routemisr.com/posts`, formdata, {
        headers,
      });
    }
  };

  const { isPending, mutate } = useMutation({
    mutationFn,
    onSuccess: () => {
      toast.success(
        isEditMode ? "Post updated successfully" : "Post created successfully",
      );

      query.invalidateQueries({
        queryKey: ["getAllPost"],
      });
      query.invalidateQueries({
        queryKey: ["getUserPosts"],
      });
      
      if (isEditMode) {
        setIsEditedLocally?.(true);
        const editedPosts = JSON.parse(
          localStorage.getItem("editedPosts") || "{}",
        );
        editedPosts[postId as string] = true;
        localStorage.setItem("editedPosts", JSON.stringify(editedPosts));
      }
      setSelectedImage(null);
      setSelectedFile(null);
      if (textInputRef.current) textInputRef.current.value = "";
      onClose();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Operation failed");
    },
  });

  if (!isOpen) return null;

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setSelectedFile(null);
  };

  function handleSubmit() {
    const formData = new FormData();

    const bodyText = textInputRef.current?.value || "";
    if (bodyText.trim()) {
      formData.append("body", bodyText);
    }
    if (selectedFile) {
      formData.append("image", selectedFile);
    }

    mutate(formData);
  }

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150 cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-white dark:bg-[#1a1a1b] rounded-2xl shadow-2xl border border-gray-200 dark:border-[#343536] overflow-hidden flex flex-col max-h-[90vh] cursor-default"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-200 dark:border-[#343536]">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white">
            {isEditMode ? "Edit Post" : "Create a Post"}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-gray-100 dark:bg-[#272729] flex items-center justify-center text-gray-500 hover:text-gray-900 dark:hover:text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* User Info Bar */}
        <div className="flex items-center gap-3 px-5 pt-4">
          <img
            src={
              userData?.photo ||
              "https://pub-3cba56bacf9f4965bbb0989e07dada12.r2.dev/linkedPosts/default-profile.png"
            }
            alt={userData?.name || "User"}
            className="w-9 h-9 rounded-full object-cover border border-gray-200 dark:border-[#343536]"
          />
          <div>
            <h4 className="text-xs font-bold text-gray-900 dark:text-white">
              {userData?.name || "Unknown User"}
            </h4>
            <div className="flex items-center gap-1 bg-gray-100 dark:bg-[#272729] px-2 py-0.5 rounded-full text-[10px] text-gray-600 dark:text-gray-300 w-fit mt-0.5">
              <Globe className="w-2.5 h-2.5" />
              <span>Public</span>
            </div>
          </div>
        </div>

        {/* Modal Body / Textarea */}
        <div className="p-5 flex-1 overflow-y-auto">
          <textarea
            ref={textInputRef}
            placeholder="What are your thoughts?"
            rows={4}
            className="w-full bg-transparent text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none resize-none"
          />

          {/* Image Preview Box */}
          {selectedImage && (
            <div className="relative mt-3 rounded-xl overflow-hidden border border-gray-200 dark:border-[#343536] max-h-60 bg-black/5">
              <img
                src={selectedImage}
                alt="Upload preview"
                className="w-full h-full object-cover max-h-60"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/70 hover:bg-black/90 text-white flex items-center justify-center transition cursor-pointer"
                title="Remove image"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Add to your post section */}
        <div className="px-5 pb-3">
          <div className="flex items-center justify-between border border-gray-200 dark:border-[#343536] rounded-xl p-2.5 bg-gray-50/50 dark:bg-[#121213]">
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
              Add media
            </span>
            <div className="flex items-center gap-1">
              <label 
                className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-[#272729] text-gray-600 dark:text-gray-300 hover:text-[#ff4500] transition cursor-pointer"
                title="Add photo"
              >
                <Image className="w-4 h-4" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>

              <button
                type="button"
                className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-[#272729] text-gray-400 transition"
                title="Video (Coming soon)"
              >
                <Video className="w-4 h-4" />
              </button>
              <button
                type="button"
                className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-[#272729] text-gray-400 transition"
                title="Emoji"
              >
                <Smile className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="p-5 pt-1">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isPending}
            className="w-full bg-[#ff4500] hover:bg-[#e03d00] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-2 rounded-full text-xs transition cursor-pointer flex items-center justify-center gap-2 shadow-2xs"
          >
            {isPending ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>{isEditMode ? "Updating..." : "Posting..."}</span>
              </>
            ) : isEditMode ? (
              "Save Changes"
            ) : (
              "Post"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
