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
  Rocket
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
    { name: "Profile", path: "/profile", icon: User },
    { name: "About", path: "/about", icon: Info },
  ];

  const sidebarVariants = {
    open: { width: "15rem", transition: { duration: 0.3, ease: "easeInOut" } },
    closed: { width: "4rem", transition: { duration: 0.3, ease: "easeInOut" } },
  };

  const handleToggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* Sidebar */}
        <motion.aside
          variants={sidebarVariants}
          initial="open"
          animate={isSidebarOpen ? "open" : "closed"}
          className="fixed top-0 left-0 h-screen bg-white shadow-lg z-50 border-r border-gray-200"
        >
          <div className="flex flex-col h-full">
            {/* Logo & Toggle */}
            <div className="p-5 flex items-center justify-between bg-gradient-to-r from-blue-500 to-purple-600 text-white">
              <AnimatePresence>
                {isSidebarOpen && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex items-center space-x-2"
                  >
                    <span className="text-2xl font-extrabold">RemoteCollab</span>
                  </motion.div>
                )}
              </AnimatePresence>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleToggleSidebar}
                className="p-2 rounded-lg bg-white/20 text-white hover:bg-white/30 transition-colors focus:outline-none"
              >
                {isSidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
              </motion.button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-6 space-y-2">
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center p-3 rounded-xl text-sm font-medium transition-all duration-200
                    ${location.pathname === item.path 
                      ? "bg-blue-500 text-white shadow-md" 
                      : "text-gray-700 hover:bg-gray-200 hover:text-blue-700"
                    }`}
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="min-w-[2rem] flex justify-center"
                  >
                    <item.icon size={20} />
                  </motion.div>
                  <AnimatePresence>
                    {isSidebarOpen && (
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="ml-3"
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
            isSidebarOpen ? "ml-60" : "ml-16"
          }`}
        >
          {/* Animated Welcome Banner */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="sticky top-0 z-40 px-6 py-4 bg-white shadow-md flex items-center justify-between border-b border-gray-200"
          >
            <div className="flex items-center space-x-4">
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{ 
                  duration: 1.5,
                  repeat: Infinity,
                  repeatDelay: 2
                }}
              >
                <Star size={22} className="text-yellow-400" />
              </motion.div>
              <div className="h-11">
                <h1 className="text-lg font-bold text-gray-800">
                  Hi, Team Star!
                </h1>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="text-sm text-gray-600 flex items-center"
                >
                  Ready to shine today?
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                    className="ml-1"
                  >
                    <Rocket size={14} className="text-blue-500" />
                  </motion.span>
                </motion.p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <motion.span
                whileHover={{ scale: 1.05 }}
                className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full"
              >
                {new Date().toLocaleDateString()}
              </motion.span>
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold shadow-sm"
              >
                JD
              </motion.div>
            </div>
          </motion.div>

          {/* Content */}
          <div className="p-8">
            <div className="max-w-7xl mx-auto">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
}