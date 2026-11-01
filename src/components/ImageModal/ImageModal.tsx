import { X } from "lucide-react";
import { useEffect } from "react";

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  altText?: string;
  title?: string;
}

export default function ImageModal({
  isOpen,
  onClose,
  imageUrl,
  altText = "Image preview",
  title = "Photo",
}: ImageModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 animate-in fade-in duration-150 cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-2xl w-full bg-white dark:bg-[#1a1a1b] rounded-2xl overflow-hidden shadow-2xl p-4 border border-gray-200 dark:border-[#343536] cursor-default"
      >
        <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-[#343536] mb-3">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white">
            {title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full bg-gray-100 dark:bg-[#272729] text-gray-500 hover:text-gray-900 dark:hover:text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center justify-center max-h-[75vh] overflow-hidden rounded-xl bg-black/40">
          <img
            src={imageUrl}
            alt={altText}
            className="w-full h-auto max-h-[75vh] object-contain"
          />
        </div>
      </div>
    </div>
  );
}
