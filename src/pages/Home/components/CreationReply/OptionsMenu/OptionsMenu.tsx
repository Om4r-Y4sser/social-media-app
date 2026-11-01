import { useRef, useState, useEffect } from "react";
import { MoreHorizontal, Edit3, Trash2 } from "lucide-react";

interface OptionsMenuProps {
  isOwner: boolean;
  onEdit: () => void;
  onDelete: () => void;
  isDeleting?: boolean;
  deleteLabel?: string;
  editLabel?: string;
}

export default function OptionsMenu({
  isOwner,
  onEdit,
  onDelete,
  isDeleting = false,
  deleteLabel = "Delete",
  editLabel = "Edit",
}: OptionsMenuProps) {
  const [showOptions, setShowOptions] = useState(false);
  const optionsRef = useRef<HTMLDivElement>(null);

  // إغلاق القائمة عند الضغط خارجها
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        optionsRef.current &&
        !optionsRef.current.contains(event.target as Node)
      ) {
        setShowOptions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!isOwner) return null;

  return (
    <div className="relative" ref={optionsRef}>
      <button
        type="button"
        onClick={() => setShowOptions((previous) => !previous)}
        aria-label="Options"
        aria-expanded={showOptions}
        className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-[#272729] transition cursor-pointer"
      >
        <MoreHorizontal className="w-4 h-4" />
      </button>

      {showOptions && (
        <div className="absolute right-0 top-full mt-1.5 z-50 w-44 overflow-hidden rounded-xl border border-gray-200 dark:border-[#343536] bg-white dark:bg-[#1a1a1b] shadow-xl py-1 text-left">
          {/* Edit Button */}
          <button
            type="button"
            onClick={() => {
              setShowOptions(false);
              onEdit();
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#272729] transition cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5 text-[#ff4500]" />
            <span>{editLabel}</span>
          </button>

          {/* Delete Button */}
          <button
            type="button"
            disabled={isDeleting}
            onClick={() => {
              setShowOptions(false);
              onDelete();
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition disabled:opacity-50 border-t border-gray-100 dark:border-[#272729] cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{isDeleting ? "Deleting..." : deleteLabel}</span>
          </button>
        </div>
      )}
    </div>
  );
}
