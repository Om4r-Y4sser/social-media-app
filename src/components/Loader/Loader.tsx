import React from "react";

export default function Loader(): React.JSX.Element {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#dae0e6] dark:bg-[#0e1113] transition-colors duration-200">
      {/* Central Reddit-Style Animated Emblem */}
      <div className="relative flex items-center justify-center mb-6">
        {/* Soft Ambient Pulsing Glow */}
        <div className="absolute w-24 h-24 bg-[#ff4500]/25 rounded-full blur-xl animate-pulse-glow" />

        {/* Orbit Ring Track */}
        <div className="w-16 h-16 rounded-full border-[2.5px] border-orange-200/50 dark:border-white/10 border-t-[#ff4500] border-r-[#ff4500]/40 animate-spin" />

        {/* Floating Center Badge with Upvote Arrow */}
        <div className="absolute w-10 h-10 bg-gradient-to-tr from-[#ff4500] to-[#ff5722] rounded-full flex items-center justify-center shadow-lg shadow-[#ff4500]/40 animate-upvote-float">
          <svg
            className="w-5 h-5 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 4L4 13h5v7h6v-7h5L12 4z" />
          </svg>
        </div>
      </div>

      {/* Brand Wordmark */}
      <div className="flex items-center gap-1.5 mb-5">
        <span className="font-black text-xl tracking-tight text-gray-900 dark:text-white">
          social
        </span>
        <span className="w-2 h-2 rounded-full bg-[#ff4500]" />
      </div>

      {/* Modern 3-Dot Staggered Bounce Wave */}
      <div className="flex items-center gap-1.5" aria-label="Loading">
        <span className="w-2 h-2 rounded-full bg-[#ff4500] animate-bounce [animation-delay:-0.32s]" />
        <span className="w-2 h-2 rounded-full bg-[#ff4500]/70 animate-bounce [animation-delay:-0.16s]" />
        <span className="w-2 h-2 rounded-full bg-[#ff4500]/40 animate-bounce" />
      </div>
    </div>
  );
}
