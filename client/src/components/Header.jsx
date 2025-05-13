import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, 
  ClipboardList, 
  Users, 
  MessageSquare, 
  User, 
  Info,
  ChevronLeft,
  ChevronRight,
  Star,
  Rocket,
  File
} from "lucide-react";

export default function Layout({ children }) {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Hide layout for auth pages
  if (location.pathname === "/sign-up" || location.pathname === "/") {
    return <div className="min-h-screen">{children}</div>;
  }

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Projects", path: "/project", icon: ClipboardList },
    { name: "Tasks", path: "/tasks", icon: ClipboardList },
    { name: "Team", path: "/team-members", icon: Users },
    { name: "Messages", path: "/messages", icon: MessageSquare },
    { name: "Files", path: "/file", icon: File },
    { name: "Profile", path: "/profile", icon: User },
    { name: "About", path: "/about", icon: Info },
  ];

  const sidebarVariants = {
    open: { width: "14rem", transition: { duration: 0.25, ease: "easeInOut" } },
    closed: { width: "3.5rem", transition: { duration: 0.25, ease: "easeInOut" } },
  };

  const handleToggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <motion.aside
          variants={sidebarVariants}
          initial="open"
          animate={isSidebarOpen ? "open" : "closed"}
          className="fixed top-0 left-0 h-screen bg-white shadow border-r border-gray-200 z-50"
        >
          <div className="flex flex-col h-full">
            {/* Logo & Toggle */}
            <div className="p-4 flex items-center justify-between bg-gray-800 text-white">
              <AnimatePresence>
                {isSidebarOpen && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="flex items-center space-x-2"
                  >
                    <span className="text-xl font-semibold">RemoteCollab</span>
                  </motion.div>
                )}
              </AnimatePresence>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleToggleSidebar}
                className="p-1.5 rounded-md bg-gray-700 text-white hover:bg-gray-600 transition-colors focus:outline-none"
              >
                {isSidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
              </motion.button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-2 py-5 space-y-1">
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center p-2 rounded-md text-sm font-medium transition-all duration-200
                    ${location.pathname === item.path 
                      ? "bg-teal-600 text-white" 
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="min-w-[2rem] flex justify-center"
                  >
                    <item.icon size={18} />
                  </motion.div>
                  <AnimatePresence>
                    {isSidebarOpen && (
                      <motion.span
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -5 }}
                        className="ml-2"
                      >
                        {item.name}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>
              ))}
            </nav>
          </div>
        </motion.aside>

        {/* Main Content */}
        <main
          className={`flex-1 transition-all duration-300 ${
            isSidebarOpen ? "ml-56" : "ml-14"
          }`}
        >
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="sticky top-0 z-40 px-5 py-3 bg-white shadow border-b border-gray-200 flex items-center justify-between"
          >
            <div className="flex items-center space-x-3">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.8, repeat: 1 }}
              >
                <Star size={20} className="text-gray-600" />
              </motion.div>
              <div>
                <h1 className="text-base font-medium text-gray-900">
                  Welcome, Team Star
                </h1>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                  className="text-xs text-gray-600 flex items-center"
                >
                  Ready to get started?
                  <span className="ml-1">
                    <Rocket size={12} className="text-teal-600" />
                  </span>
                </motion.p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <motion.span
                whileHover={{ scale: 1.03 }}
                className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-md"
              >
                {new Date().toLocaleDateString()}
              </motion.span>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="h-7 w-7 rounded-full bg-teal-600 flex items-center justify-center text-white font-medium text-sm"
              >
                JD
              </motion.div>
            </div>
          </motion.div>

          {/* Content */}
          <div className="p-6">
            <div className="max-w-7xl mx-auto">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
}