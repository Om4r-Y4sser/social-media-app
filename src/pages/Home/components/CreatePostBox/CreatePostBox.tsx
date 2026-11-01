import { Image } from "lucide-react";
import { userDataContext } from "../../../../Context/userData.Context";
import { useContext, useState } from "react";
import CreatePostModal from "../CreatePostModal/CreatePostModal";

export default function CreatePost() {
  const user = useContext(userDataContext);
  const userData = user?.userData;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
      setIsModalOpen(true);
    }
  };

  return (
    <div
      className="w-full bg-white dark:bg-[#1a1a1b] border border-gray-200 dark:border-[#343536] rounded-xl p-3 shadow-2xs transition-colors"
      dir="ltr"
    >
      <div className="flex items-center gap-3">
        {/* User avatar */}
        <img
          src={
            userData?.photo ||
            "https://pub-3cba56bacf9f4965bbb0989e07dada12.r2.dev/linkedPosts/default-profile.png"
          }
          alt={userData?.name || "User"}
          className="w-9 h-9 rounded-full object-cover shrink-0 border border-gray-200 dark:border-[#343536]"
        />

        {/* Input box trigger */}
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="flex-1 min-w-0 bg-[#f6f7f8] dark:bg-[#272729] hover:bg-white dark:hover:bg-[#121213] border border-gray-200 dark:border-[#343536] hover:border-gray-300 dark:hover:border-gray-500 transition rounded-lg px-3.5 py-2 cursor-pointer text-left overflow-hidden shadow-2xs"
        >
          <span className="block text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-normal truncate">
            {`Create Post as ${userData?.name?.split(" ")[0] || "user"}...`}
          </span>
        </button>

        {/* Quick image picker */}
        <label 
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#272729] text-gray-500 dark:text-gray-400 hover:text-[#ff4500] transition cursor-pointer shrink-0"
          title="Upload image"
        >
          <Image className="w-5 h-5" />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </label>
      </div>

      <CreatePostModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedFile(null);
          setImagePreview(null);
        }}
        selectedImage={imagePreview}
        selectedFile={selectedFile}
        handleImageChange={handleImageChange}
        setSelectedImage={setImagePreview}
        setSelectedFile={setSelectedFile}
      />
    </div>
  );
}
