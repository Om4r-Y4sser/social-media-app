import { Outlet } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/Navbar/Navbar";
import RightSidebar from "../../components/RightSidebar/RightSidebar";
import { ScrollToTop } from "../../components/ScrollToTop/ScrollToTop";

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-[#dae0e6] dark:bg-[#0e1113] text-gray-900 dark:text-gray-100 font-sans" dir="ltr">
      {/* Top Header Navbar */}
      <Navbar />

      {/* 3-Column Content Container */}
      <div className="max-w-[1280px] mx-auto flex justify-center px-0 sm:px-4">
        {/* Left Navigation Sidebar */}
        <Sidebar />

        {/* Central Feed / Page Content */}
        <main className="flex-1 min-w-0 max-w-2xl w-full py-4 px-2 sm:px-4">
          <ScrollToTop />
          <Outlet />
        </main>

        {/* Right Info / Follow Sidebar */}
        <RightSidebar />
      </div>
    </div>
  );
}
