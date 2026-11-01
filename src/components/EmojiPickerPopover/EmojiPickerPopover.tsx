import { useRef, useEffect } from "react";
import EmojiPicker, { Theme, type EmojiClickData } from "emoji-picker-react";
import { Smile } from "lucide-react";
import { useTheme } from "../../Context/ThemeContext";

interface EmojiPickerPopoverProps {
  onEmojiSelect: (emoji: string) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean | ((prev: boolean) => boolean)) => void;
}

export default function EmojiPickerPopover({
  onEmojiSelect,
  isOpen,
  setIsOpen,
}: EmojiPickerPopoverProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  // إغلاق القائمة عند الضغط خارج المكون
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, setIsOpen]);

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    onEmojiSelect(emojiData.emoji);
  };

  return (
    <div className="relative inline-block" ref={containerRef}>
      {/* Emoji Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`p-1.5 rounded-lg transition cursor-pointer flex items-center justify-center ${
          isOpen
            ? "text-[#ff4500] bg-gray-100 dark:bg-[#272729]"
            : "text-gray-400 hover:text-[#ff4500] dark:hover:text-[#ff4500] hover:bg-gray-100 dark:hover:bg-[#272729]"
        }`}
        title="Add emoji"
      >
        <Smile className="w-4 h-4" />
      </button>

      {/* Emoji Picker Popover */}
      {isOpen && (
        <div className="absolute left-0 bottom-full mb-2 z-50 shadow-2xl rounded-2xl overflow-hidden bg-white dark:bg-[#1a1a1b] border border-gray-200 dark:border-[#343536] animate-in fade-in zoom-in-95 duration-100">
          <div className="w-[280px] sm:w-[320px]">
            <EmojiPicker
              onEmojiClick={handleEmojiClick}
              theme={theme === "dark" ? Theme.DARK : Theme.LIGHT}
              lazyLoadEmojis={true}
              searchDisabled={false}
              width="100%"
              height={340}
              previewConfig={{ showPreview: false }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
