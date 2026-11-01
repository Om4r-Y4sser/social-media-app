import { Search, ChevronDown, Sun, Moon, User, Home, LogOut, Settings } from "lucide-react";
import { useTheme } from "../../Context/ThemeContext";
import { useContext, useState, useRef, useEffect } from "react";
import { userDataContext } from "../../Context/userData.Context";
import { useNavigate, NavLink } from "react-router-dom";
import NotificationsPopover from "../../pages/Notifications/Notifications";

export default function Navbar() {
  const user = useContext(userDataContext);
  const userData = user?.userData;
  const setUserData = user?.setuserData;
  
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  // حالات الدروب داون الموحدة
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // إغلاق القائمة عند الضغط خارجها
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    if (setUserData) {
      setUserData(null);
    }
    navigate("/login");
  };

  return (
    <>
      {/* 1. TOP HEADER (Reddit-Inspired Navbar) */}
      <header className="w-full h-14 flex items-center justify-between gap-3 sm:gap-6 px-3 sm:px-6 bg-white dark:bg-[#1a1a1b] border-b border-gray-200 dark:border-[#343536] sticky top-0 z-40 transition-colors duration-200">
        
        {/* Brand Logo - Reddit Inspired */}
        <div 
          onClick={() => navigate("/")} 
          className="flex items-center gap-2 cursor-pointer shrink-0 group"
          title="Home"
        >
          <div className="w-9 h-9 rounded-full bg-[#ff4500] flex items-center justify-center text-white font-extrabold text-base shadow-sm group-hover:opacity-95 transition">
            S
          </div>
          <div className="flex items-center font-bold tracking-tight">
            <span className="text-gray-900 dark:text-white text-lg font-black tracking-tighter">social</span>
            <span className="text-[#ff4500] text-lg font-black">.</span>
          </div>
        </div>

        {/* Search Bar - Reddit Pill Style */}
        <div className="flex-1 max-w-xl relative">
          <div className="flex items-center w-full bg-[#f6f7f8] dark:bg-[#272729] hover:bg-white dark:hover:bg-[#121213] text-xs sm:text-sm text-gray-900 dark:text-gray-100 rounded-full border border-gray-200 dark:border-[#343536] hover:border-gray-300 dark:hover:border-gray-600 focus-within:border-[#ff4500] focus-within:bg-white dark:focus-within:bg-[#121213] transition-all px-3.5 py-1.5 shadow-2xs">
            <Search className="w-4 h-4 text-gray-400 shrink-0 mr-2.5" />
            <input
              type="text"
              placeholder="Search in social..."
              className="w-full bg-transparent border-none outline-none text-xs sm:text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Desktop Theme & Notifications */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#272729] text-gray-600 dark:text-gray-300 hover:text-[#ff4500] dark:hover:text-[#ff4500] transition-colors cursor-pointer"
              title="Toggle Dark/Light Mode"
              aria-label="Toggle Dark/Light Mode"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5 text-amber-400" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            <NotificationsPopover />
          </div>

          {/* User Profile Pill & Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button 
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1 rounded-full border border-transparent hover:border-gray-200 dark:hover:border-[#343536] hover:bg-gray-100 dark:hover:bg-[#272729] transition cursor-pointer"
            >
              <img
                src={userData?.photo || "https://pub-3cba56bacf9f4965bbb0989e07dada12.r2.dev/linkedPosts/default-profile.png"}
                alt={userData?.name || "User"}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border border-gray-200 dark:border-gray-700"
              />
              <span className="hidden lg:inline-block text-xs font-semibold text-gray-800 dark:text-gray-200 max-w-[100px] truncate">
                {userData?.name || "Profile"}
              </span>
              <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
              <div className="absolute right-0 mt-2 w-60 bg-white dark:bg-[#1a1a1b] border border-gray-200 dark:border-[#343536] rounded-xl shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100 text-left">
                
                {/* User info banner */}
                <div 
                  onClick={() => { setIsOpen(false); navigate(`/profile/`); }}
                  className="px-4 py-2.5 border-b border-gray-100 dark:border-[#272729] cursor-pointer hover:bg-gray-50 dark:hover:bg-[#272729] transition"
                >
                  <p className="text-xs font-bold text-gray-900 dark:text-white truncate">{userData?.name || "User"}</p>
                  <p className="text-[11px] text-[#ff4500] font-medium truncate">u/{userData?.username || userData?.email?.split('@')[0] || "profile"}</p>
                </div>

                <div className="py-1">
                  {/* Theme appearance option on mobile */}
                  <button
                    onClick={() => toggleTheme()}
                    className="w-full flex items-center justify-between px-4 py-2.5 text-xs font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#272729] transition cursor-pointer md:hidden"
                  >
                    <span className="flex items-center gap-3">
                      {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-gray-500" />}
                      <span>Appearance</span>
                    </span>
                    <span className="text-[10px] text-gray-400 uppercase font-semibold">{theme}</span>
                  </button>

                  <button
                    onClick={() => { setIsOpen(false); navigate(`/profile`); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#272729] transition cursor-pointer"
                  >
                    <User className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    <span>View Profile</span>
                  </button>

                  <button
                    onClick={() => { setIsOpen(false); navigate("/setting"); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#272729] transition cursor-pointer"
                  >
                    <Settings className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    <span>User Settings</span>
                  </button>
                </div>

                <div className="border-t border-gray-100 dark:border-[#272729] my-1"></div>

                {/* Logout */}
                <div className="py-1">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </header>

      {/* 2. MOBILE BOTTOM NAVIGATION BAR */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-14 bg-white dark:bg-[#1a1a1b] border-t border-gray-200 dark:border-[#343536] flex items-center justify-around px-2 z-40 shadow-lg">
        
        {/* Home */}
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
              isActive ? "text-[#ff4500] font-bold" : "text-gray-500 dark:text-gray-400 hover:text-gray-700"
            }`
          }
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 font-medium">Home</span>
        </NavLink>

        {/* Notifications */}
        <div className="flex flex-col items-center justify-center flex-1 py-1">
          <NotificationsPopover />
        </div>

        {/* Profile */}
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
              isActive ? "text-[#ff4500] font-bold" : "text-gray-500 dark:text-gray-400 hover:text-gray-700"
            }`
          }
        >
          <img
            src={userData?.photo || "https://pub-3cba56bacf9f4965bbb0989e07dada12.r2.dev/linkedPosts/default-profile.png"}
            alt={userData?.name || "Profile"}
            className="w-6 h-6 rounded-full object-cover ring-1 ring-current"
          />
          <span className="text-[10px] mt-0.5 font-medium">Profile</span>
        </NavLink>

      </nav>
    </>
  );
}
