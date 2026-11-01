interface LoaderProps {
  fullScreen?: boolean;
  text?: string;
}

export default function Loader({
  fullScreen = true,
  text = "Loading...",
}: LoaderProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 transition-colors duration-200 ${
        fullScreen
          ? "fixed inset-0 min-h-screen bg-[#dae0e6]/85 dark:bg-[#0e1113]/85 backdrop-blur-xs z-50"
          : "w-full py-10 bg-transparent"
      }`}
      dir="ltr"
    >
      {/* Upvote Pulse + Orbit Ring */}
      <div className="relative flex items-center justify-center">
        {/* Ambient Glow */}
        <div className="absolute w-12 h-12 bg-[#ff4500]/20 rounded-full blur-md animate-pulse-glow" />

        {/* Orbit Spinner */}
        <div className="w-10 h-10 rounded-full border-2 border-orange-200/50 dark:border-white/10 border-t-[#ff4500] border-r-[#ff4500]/40 animate-spin" />

        {/* Mini Upvote Chevron */}
        <div className="absolute w-6 h-6 bg-gradient-to-tr from-[#ff4500] to-[#ff5722] rounded-full flex items-center justify-center shadow-xs shadow-[#ff4500]/40 animate-upvote-float">
          <svg
            className="w-3.5 h-3.5 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 4L4 13h5v7h6v-7h5L12 4z" />
          </svg>
        </div>
      </div>

      {/* Text & Staggered Dots */}
      <div className="flex flex-col items-center gap-1.5">
        {text && (
          <p className="text-xs font-medium tracking-wide text-gray-600 dark:text-gray-300">
            {text}
          </p>
        )}
        <div className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#ff4500] animate-bounce [animation-delay:-0.32s]" />
          <span className="w-1.5 h-1.5 rounded-full bg-[#ff4500]/70 animate-bounce [animation-delay:-0.16s]" />
          <span className="w-1.5 h-1.5 rounded-full bg-[#ff4500]/40 animate-bounce" />
        </div>
      </div>
    </div>
  );
}
