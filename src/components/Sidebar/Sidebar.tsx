import { NavLink, useNavigate } from "react-router-dom";
import { Home, User, Settings, LogOut } from "lucide-react";

export default function Sidebar() {
  const navigate = useNavigate();

  const menuItems = [
    { name: "Home", path: "/", icon: Home },
    { name: "Profile", path: "/profile", icon: User },
    { name: "Settings", path: "/setting", icon: Settings },
  ];

  function logOut() {
    localStorage.removeItem("userToken");
    navigate("/login");
  }

  return (
    <aside className="w-56 lg:w-60 h-[calc(100vh-3.5rem)] sticky top-14 flex flex-col justify-between py-4 px-3 border-r border-gray-200 dark:border-[#343536] bg-white dark:bg-[#1a1a1b] hidden md:flex transition-colors duration-200 shrink-0">
      {/* Top Navigation Section */}
      <div>
        <div className="px-3 pb-2 pt-1">
          <p className="text-[11px] font-bold tracking-wider text-gray-400 dark:text-gray-500 uppercase">
            Feeds
          </p>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            
            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) => `
                  flex items-center gap-3.5 px-3 py-2.5 rounded-full text-xs font-semibold transition-all duration-150 relative
                  ${
                    isActive
                      ? "text-[#ff4500] bg-[#ff4500]/10 dark:bg-[#ff4500]/15 font-bold"
                      : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#272729]"
                  }
                `}
              >
                {({ isActive }) => (
                  <>
                    {/* Active Bar indicator */}
                    {isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-[#ff4500] rounded-r-full" />
                    )}

                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        isActive
                          ? "text-[#ff4500]"
                          : "text-gray-500 dark:text-gray-400"
                      }`}
                    />
                    <span className="truncate">{item.name}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section: Logout & Policies */}
      <div className="pt-3 border-t border-gray-200 dark:border-[#343536]">
        <button
          onClick={logOut}
          className="flex items-center gap-3 px-3 py-2 w-full text-xs font-semibold text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-full transition cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Log Out</span>
        </button>

        <div className="px-3 pt-4 text-[10px] text-gray-400 dark:text-gray-500 leading-relaxed">
          <p>© 2026 Social Reddit App</p>
        </div>
      </div>
    </aside>
  );
}
